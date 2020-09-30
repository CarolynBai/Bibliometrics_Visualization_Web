<?php


//连接数据库
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Bibliometric";

// 创建连接
$conn = new mysqli($servername, $username, $password,$dbname);
// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}
//else{
// echo "连接成功";}
?>
