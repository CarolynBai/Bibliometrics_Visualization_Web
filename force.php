<?php
$con = mysqli_connect('localhost','byn','Bibliometric');//“ª∞„ «”–√‹¬ÎµƒΩ®“ÈºÏ≤È“ªœ¬('localhost','”√ªß√˚£®“ª∞„ «root£©','√‹¬Î','Bibliometric')
if(!$con)
    die("connect error:".mysqli_connect_error());
//selectµ⁄“ª∏ˆ±Ìµƒ ˝æ›
$sql1="select id,name from author";
$result=mysqli_query($con,$sql1);
if(! $result )
{
    die('error ' . mysqli_error($con));
}
$arr=array();
$i=0;
//Ω´√øÃı ˝æ›∑≈Ω¯Õ¨“ª∏ˆarray
while($row = mysqli_fetch_array($res,MYSQLI_ASSOC)){
    $arr[$i]=$row;
    $i++;
}
$num = count($arr);
echo"$num";
$i=0;
//updateÀ˘”–µƒid1
while($i<$num){
    $id1=$arr[$i]['id'];
    $name1= $arr[$i]['name'];
    $sql2="update Co-auth set id1=$id1 where name1 = '$name1'";
    $result2=mysqli_query($con,$sql2);
    if(! $result2 )
    {
        die('error ' . mysqli_error($con));
    }
    $i++;
}
$i=0;
//updateÀ˘”–µƒid2
while($i<$num){
    $id2=$arr[$i]['id'];
    $name2= $arr[$i]['name'];
    $sql3="update Co-auth set id2=$id2 where name2 = '$name2'";
    $result3=mysqli_query($con,$sql3);
    if(! $result3 )
    {
        die('error ' . mysqli_error($con));
    }
    $i++;
}
$con->close();