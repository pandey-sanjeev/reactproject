<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Credentials', 'true');
header("Access-Control-Allow-Headers: Content-Type, Origin, Accept, Authorization, X-Requested-With");

class User_controller extends CI_Controller {

	public function __construct()
    {
		parent::__construct();
		$this->load->model('User_model');
        $this->load->library('CreatorJwt');
        $this->objOfJwt = new CreatorJwt();
        $this->load->library('email');

    }
	public function index()
	{
		echo "hii";
	}
	public function insertdata()
    {    
        $sendData = json_decode(file_get_contents('php://input'), true);    
        if( ! empty($sendData)) 
        { 
            $name = $sendData['name'];
            $fathername = $sendData['fathername'];
            $dob = $sendData['dob'];
            $address = $sendData['address'];
            $email = $sendData['email'];
            $password = $sendData['password'];
             
            $sendData=array(
                'name'=>$name,
                'fathername'=>$fathername,
                'dob'=>$dob,
                'address'=>$address,
                'email'=>$email,
                'password'=>$password,
                'is_deleted'=>1,
                 );
            $insertid = $this->User_model->insertUserData($sendData);
            if($insertid)
                    {      
                        $tokenData['userId'] = $insertid;
                        $tokenData['email'] = $email;
                        $bearerToken = $this->objOfJwt->GenerateToken($tokenData);
                        $Userdata=$this->User_model->Userdata($insertid);
                        $logindata = $Userdata[0];

                        echo json_encode(["token"=>$bearerToken,"logindata"=>$logindata]);
                    }
                    else
                    {
                        echo json_encode(["error"=>"user not inserted"]); 
                    }           
        }
        else 
        {
            echo json_encode(["error"=>"Error"]);                    
        }
    }
    public function checkuser()
    {
        $sendData = json_decode(file_get_contents('php://input'), true);    
        if( ! empty($sendData)) 
        { 
            $email = $sendData['email'];
            $password = $sendData['password'];            
            $Userdata = $this->User_model->checkuser($email,$password);

            if($Userdata)
            {   
                $firstItem = $Userdata[0];
                $userId = $firstItem['userid'];
                $email =$firstItem['email'];
                $tokenData['userId'] = $userId;
                $tokenData['email'] = $email;
                $bearerToken = $this->objOfJwt->GenerateToken($tokenData);
                echo json_encode(["token"=>$bearerToken,"logindata"=>$firstItem]);
            }
            else
            {
                echo json_encode([ "code"=> 404, "error"=>"user not found"]);                    
            }           
        }
        else 
        {
            echo json_encode(["error"=>"Error"]);                    
        }

    }
    public function updatedata()
    {
        $token = $this->input->get_request_header('Authorization');

        if ($token) 
        {
            $token = str_replace('Bearer ', '', $token);
            try
            {
                $secret_key = 'your_secret_key';
                $decoded = $this->objOfJwt->DecodeToken($token);
                $userid= $decoded['userId'];
                $data = json_decode(file_get_contents('php://input'), true);
                $userid = $userid;
                $name = $data['name'];
                $fathername = $data['fathername'];
                $dob = $data['dob'];
                $address = $data['address'];
                $email = $data['email'];
                $password = $data['password'];

                if ($userid)
                    {
                        $dataArray = array(
                        'userid'=>$userid,
                        'name'=>$name,
                        'fathername'=>$fathername,
                        'dob'=>$dob,
                        'address'=>$address,
                        'email'=>$email,
                        'password'=>$password,
                        'is_deleted'=>1,

                    );
                        $userupdate=$this->User_model->userupdate($dataArray);
                        if ($userupdate)
                        {
                            $userId = $dataArray['userid'];
                            $userupdatedata=$this->User_model->Userdata($userId);

                            echo json_encode(["success"=>"Data Updated.", "userupdatedata"=>$userupdatedata]);

                        }else
                        {
                            echo json_encode([ "error"=>"Data not Updated"]);
                        }
                    }else
                    {
                        echo json_encode(["error"=>"something went wrong"]);
                    }

            }catch (Exception $e) 
            {
                echo json_encode(["error"=>"Error"]);                    
            }
            
        }else 
        {
            echo json_encode(["error"=>"no token"]);                    
        }

    }
    Public function generateNumericOTP() {
      
        $generator = "1357902468";
        $result = "";
        for ($i = 1; $i <= 4; $i++) {
            $result .= substr($generator, (rand()%(strlen($generator))), 1);
        }
        return $result;      
    }  
    public function sendmail()
    {
        $formData = json_decode(file_get_contents('php://input'), true); 
            if( ! empty($formData)) 
            { 
                $email = $formData['email'];
                         
                $Userdata = $this->User_model->checkemail($email);
                $subject ="your code";
                
                if($Userdata)
                        {   
                            $firstItem = $Userdata[0]; 
                            $otp = $this->generateNumericOTP();
                            $userid =$firstItem['userid'];
                            $name = $firstItem['name'];
                            $update_otp= $this->User_model->update_otp($userid, $otp);
                            $userdata =array(

                                'userid' => $userid,
                                'name' =>$name,
                                'email' =>$email,
                            );
                            if($update_otp)
                            {
                                // $this->email->from('myproject608@gmail.com', 'myproject');
                                // $this->email->to($email);
                                // $this->email->subject($subject);
                                // $this->email->message( $otp);
                                // $sendmailsuccess= $this->email->send()
                                $sendmailsuccess =true;
                                if ($sendmailsuccess) {
                                    echo json_encode(["userdata"=>$userdata, "message"=>"Mail send successfully"]);
                                } else {
                                    echo 'Email could not be sent. Error: ' . $this->email->print_debugger();
                                    echo json_encode(["error"=>"Something Went Wrong"]);
                                }
                                
                            }else
                            {
                                echo json_encode(["error"=>"Something Went Wrong"]);
                            }
                            
                        }
                        else
                        {
                            echo json_encode([ "code"=> 404, "error"=>"Email not found , enter registered email "]);                    
                        }           
            }
            else 
            {
                echo json_encode(["error"=>"Error"]);                    
            }
    }

    public function verifycode()
    {
        $sendData = json_decode(file_get_contents('php://input'), true);    
        if( ! empty($sendData)) 
        { 
            $email = $sendData['email'];
            $code = $sendData['code']; 
            $password = $sendData['password'];            
            $Userdata = $this->User_model->verifycode($email,$code);

            if($Userdata)
                    {   
                        $reset_password= $this->User_model->reset_password($email,$password);
                        if($reset_password)
                            {
                                echo json_encode(["message"=>"Successfully Your Password is reset"]);
                            }else
                            {
                                echo json_encode(["error"=>"Something Went Wrong"]);
                            }
                    }
                    else
                    {
                        echo json_encode([ "error"=>"Enter valid code "]);                    
                    }           
        }
        else 
        {
            echo json_encode(["error"=>"Error"]);                    
        }

    }
    public function addtodo()
    {
        
        $token = $this->input->get_request_header('Authorization');

        if ($token) {
            $token = str_replace('Bearer ', '', $token);
            try
            {
                $secret_key = 'your_secret_key';
                $decoded = $this->objOfJwt->DecodeToken($token);
                $userid= $decoded['userId'];
                $sendData = json_decode(file_get_contents('php://input'), true);    

                if( ! empty($sendData)) 
                { 

                    $todotitle = $sendData['todotitle'];
                    $description = $sendData['description'];

                    $sendData=array(
                        'todotitle'=>$todotitle,
                        'description'=>$description,
                        'userid'=>$userid,
                        'is_deleted'=>1,
                        );
                    $insertid = $this->User_model->inserttodoData($sendData);
                    if($insertid)
                    {      
                        echo json_encode(["success"=>"Todo inserted"]);
                    }
                    else
                    {
                        echo json_encode(["error"=>"user not inserted"]); 
                    }  
                }else 
        {
            echo json_encode(["error"=>"Error"]);                    
        }

            }catch (Exception $e) 
            {
                echo json_encode(["error"=>"Error"]);                    
            }
            
        }else 
        {
            echo json_encode(["error"=>"Error"]);                    
        }

    }
    public function usertodolist()
    {
        
        $token = $this->input->get_request_header('Authorization');

        if ($token) 
        {
            $token = str_replace('Bearer ', '', $token);
            try
            {
                $secret_key = 'your_secret_key';
                $decoded = $this->objOfJwt->DecodeToken($token);
                $userid= $decoded['userId'];
                $tododata=$this->User_model->usertodolist($userid);
                if($tododata)
                {   
                    echo json_encode($tododata);
                }
                else
                {
                    echo json_encode([ "code"=> 404, "error"=>"data not found"]);                    
                }         

            }catch (Exception $e) 
            {
                echo json_encode(["error"=>"Error"]);                    
            }
            
        }else 
        {
            echo json_encode(["error"=>"Error"]);                    
        }

    }
    public function deletetodo()
    {
        $token = $this->input->get_request_header('Authorization');

        if ($token) 
        {
            $token = str_replace('Bearer ', '', $token);
            try
            {
                $secret_key = 'your_secret_key';
                $decoded = $this->objOfJwt->DecodeToken($token);
                $userid= $decoded['userId'];
                $data = json_decode(file_get_contents('php://input'), true);
                $todoid = $data['todoid'];    
                $tododetail=$this->User_model->tododetail($todoid ,$userid);
                $todoid=$tododetail[0]['todoid'];
                if ($todoid)
            {
                $dataArray = array(
				'todoid'=>$todoid,
				'is_deleted' =>0,
				);
				$lastupdate=$this->User_model->deletetodo($dataArray);
				if ($lastupdate)
                {
                    echo json_encode(["success"=>"Todo deleted."]);

				}else
                {
                    echo json_encode(["error"=>"something went wrong"]);
				}
			}else
            {
                echo json_encode(["error"=>"something went wrong"]);
            }


            }catch (Exception $e) 
            {
                echo json_encode(["error"=>"Error"]);                    
            }
            
        }else 
        {
            echo json_encode(["error"=>"Error"]);                    
        }
    }
    public function tododata()
    {
        $token = $this->input->get_request_header('Authorization');

        if ($token) 
        {
            $token = str_replace('Bearer ', '', $token);
            try
            {
                $secret_key = 'your_secret_key';
                $decoded = $this->objOfJwt->DecodeToken($token);
                $userid= $decoded['userId'];
                $data = json_decode(file_get_contents('php://input'), true);
                $todoid = $data['id'];  
                $tododetail=$this->User_model->tododetail($todoid ,$userid);
                echo json_encode($tododetail);

            }catch (Exception $e) 
            {
                echo json_encode(["error"=>"Error"]);                    
            }
            
        }else 
        {
            echo json_encode(["error"=>"no token"]);                    
        }
    }  
    public function edittodo()
    {
        $token = $this->input->get_request_header('Authorization');

        if ($token) 
        {
            $token = str_replace('Bearer ', '', $token);
            try
            {
                $secret_key = 'your_secret_key';
                $decoded = $this->objOfJwt->DecodeToken($token);
                $userid= $decoded['userId'];
                $data = json_decode(file_get_contents('php://input'), true);
                $todotitle = $data['todotitle'];
                $description = $data['description'];
                $todoid = $data['todoid'];

                if ($todoid)
                {
                    $dataArray = array(
                    'todoid'=>$todoid,
                    'todotitle'=>$todotitle,
                    'description'=>$description,
                );
                $todoupdate=$this->User_model->edittodo($dataArray);
                    if ($todoupdate)
                    {
                        echo json_encode(["success"=>"Data Updated."]);

                    }else
                    {
                        echo json_encode([ "error"=>"Data not Updated"]);
                    }
                }else
                {
                    echo json_encode(["error"=>"something went wrong"]);
                }
                    

            }catch (Exception $e) 
            {
                echo json_encode(["error"=>"Error"]);                    
            }
            
        }else 
        {
            echo json_encode(["error"=>"no token"]);                    
        }
    }  
}