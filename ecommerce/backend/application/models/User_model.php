<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model{
    
  public function insertUserData($sendData)
    {
    $insert=$this->db->insert('user',$sendData);
    return $this->db->insert_id();
    } 
  public function checkuser($email,$password)
  {
    $this->db->select('*');
    $this->db->from('user');
    $this->db->where('email',$email);
    $this->db->where('password',$password);
    $this->db->where('is_deleted',1);
    $query=$this->db->get();
    return $query->result_array();
  }
  public function userdata($insertid)
  {
    $this->db->select('*');
    $this->db->from('user');
    $this->db->where('userid',$insertid);
    $query=$this->db->get();
    return $query->result_array();
  }
  public function userupdate($data=array())
  {
    $this->db->where('userid',$data['userid']);
    $this->db->update("user",$data);
    return true;
  }	
  public function checkemail($email)
  {
    $this->db->select('*');
    $this->db->from('user');
    $this->db->where('email',$email);
    $this->db->where('is_deleted',1);
    $query=$this->db->get();
    return $query->result_array();
  }
  public function update_otp($userid, $otp)
  {
    $data = array(
      'code' => $otp,
  );
    $this->db->where('userid',$userid);
    $this->db->update("user",$data);
    return true;
  }
  public function verifycode($email,$code)
  {
    $this->db->select('*');
    $this->db->from('user');
    $this->db->where('email',$email);
    $this->db->where('code',$code);
    $query=$this->db->get();
    return $query->result_array();
  }
  public function reset_password($email,$password)
  {
    $data = array(
      'password' => $password,
      'code'=> "",
  );
    $this->db->where('email',$email);
    $this->db->update("user",$data);
    return true;
  }
  public function inserttodoData($sendData)
    {
    $insert=$this->db->insert('todolist',$sendData);
    return $this->db->insert_id();
    } 
  public function usertodolist($userid)
  {
    $this->db->select('*');
    $this->db->from('todolist');
    $this->db->where('userid',$userid);
    $this->db->where('is_deleted',1);
    $query=$this->db->get();
    return $query->result_array();
  }
  public function tododetail($todoid ,$userid)
	{
		$this->db->select('*');
		$this->db->from("todolist");
		$this->db->where('todoid',$todoid);
		$this->db->where('userid',$userid);
		$this->db->where('is_deleted',1);
		$query = $this->db->get();
		return $query->result_array();
	}
  public function deletetodo($data=array())
	{
	  $this->db->where('todoid',$data['todoid']);
	  $this->db->update("todolist",$data);
	  return true;
	}
  public function edittodo($data=array())
  {
	  $this->db->where('todoid',$data['todoid']);
	  $this->db->update("todolist",$data);
    return true;
  }
}