<?php
header("Content-type: text/html; charset=UTF-8");
// error_reporting(E_ERROR); 
// ini_set("display_errors","Off"); //不显示error和notice等
include_once("Connect.php");//这是连接数据库的php的相对路径
session_start();/*开启会话*/

$post = json_decode(file_get_contents("php://input"), true);
$method = $post["method"];
$textInput = $post["input"];
//$byn = json_encode((object) array("status" => "success","method" => "$method", "userInput" => $textInput, "fileData" => null));
//echo $byn;
//这里的变量就对应前端发来请求的json里的比如
//post的就是前端发来的json里的  比如这里的zuozhe  那对应的前端发来的json里就应该有 {zuozhe:“byn”}
//下面我是根据不同的查询方式就用不同的sql语句来查询
function Display($conn){ //排序可以做成一点击实现升序或者倒序？这里的$conn是用来连接数据库的参数，另外还有一个php专门用来连接数据库
    global $conn;
    global $textInput;
    global $method;
    $i = 0;//每页数据的第几个
    $flag = $method;
    $sql = "";

    switch ($flag) {
        case 0: //默认形式
            $sql = "SELECT * FROM `search` "; //默认
        //    $sqltotal = "SELECT COUNT(*) FROM `search` ";
            break;
        case 1: //按年份搜索
            $sql = "SELECT * FROM `search` WHERE `Year`LIKE'%$textInput%'ORDER BY `Year` desc";
        //    $sqltotal = "SELECT COUNT(*) FROM `search`WHERE `Year` LIKE'%$textInput%' ";
            break;
        case 2: //按题目搜索
            $sql = "SELECT * FROM `search` WHERE `Title`LIKE'%$textInput%'ORDER BY `Year` desc ";
        //    $sqltotal = "SELECT COUNT(*) FROM `search`WHERE `Title` LIKE'%$textInput%' ";
            break;
        case 3: //按作者名称检索
            $sql = "SELECT * FROM `search` WHERE `Authors`LIKE'%$textInput%'ORDER BY `Year` desc";
        //    $sqltotal = "SELECT COUNT(*) FROM `search`WHERE `Authors` LIKE'%$textInput%' ";
            break;
        case 4: //按关键词模糊搜索
            $sql = "SELECT * FROM `search` WHERE `Keywords` LIKE '%$textInput%'ORDER BY `Year` desc";
        //    $sqltotal = "SELECT COUNT(*) FROM `search` WHERE `Keywords` LIKE '%$textInput%' ";
            break;

        case 6://error
                 $errorJson=json_encode((object)array("status"=>"error","fileData"=>null));
                echo $errorJson;
                 break;

        default: $sql="SELECT * FROM `search`";//默认
    }
   
        $result = mysqli_query($conn, $sql); //获取后台文件总条数
     //   $total = mysqli_query($conn, $sqltotal);
     //   $totalarr = mysqli_fetch_array($total);
      //  $totalnum = $totalarr[0];
//echo json_encode((object) array("status" => "success", "method" => "$method", "userInput" => $textInput,  "fileData" => $result));
        if ($result !== false) {
        
            if (mysqli_num_rows($result) < 1) { //无数据返回的json
                $nodataJson = json_encode((object) array("status" => "noData", "method" => "$method", "userInput" => $textInput,  "fileData" => null));
                echo $nodataJson;
            } else { //数据正常返回json
                while ($i < 200) {
                    $datarow = mysqli_fetch_assoc($result);
                    $dataarr[$i] = ($datarow);
                    $i++;
                }
                $successJson = json_encode((object) array("status" => "success", "method" => "$method", "userInput" => $textInput,"fileData" => $dataarr));
                echo $successJson;
            }
        } else { //查询失败返回json
            $failJson = json_encode((object) array("status" => "fail", "method" => "$method", "userInput" => $textInput, "fileData" => null));
            echo $failJson;
        }
}
Display($conn);
$conn->close();
$conn = null;
// select * from search where 组名 in (select  组名 from search group by 组名 order by 组名 limit 0, 2) order by 组名, id
