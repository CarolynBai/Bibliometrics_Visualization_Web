
var methodChoice;

var title = '  <tr>' +
  '<th>Year</th>' +
  '<th>Title</th>' +
  '<th>Authors</th>' +
  '<th>Keywords</th>' +
  '</tr>';


function sortType(evt) {//判断哪个按钮被按下并且传值用于请求数据
  var obj = window.event ? event.srcElement : evt.target;
  var choice = obj.value;
  // $("#text-input").val("");搜索后清空文本框
  requestData(choice, 1);//按下时请求第一页数据
}

function myFile() {
  methodChoice = 4;
  requestData(4, 1);//查询本用户上传的文件
}


function requestData(choice) {
  var input = $("#text-input").val();
  methodChoice = choice;
  switch (choice) {
    case 0://用于翻页时的请求方式
      var currentMethod = dataGet.method;
      methodChoice = currentMethod;
      console.log(currentMethod);
      var currentInput = dataGet.userInput;
      if (typeof (currentInput) == "undefined") {
        currentInput = null;
      }
      console.log(currentInput);
      myData = { "method": currentMethod, "input": currentInput };
      break;
    case 1:
      myData = { "method": 0, "input": null};//默认排序
      break;

    case "by Year": myData = { "method": 1, "input": input};
      break;

    case "by Title": myData = { "method": 2, "input": input};
      break;

    case "by Author": myData = { "method": 3, "input": input };
      break;

    case "by Keywords": myData = { "method": 4, "input": input};
      break;

  }
  console.log(myData);

  $.ajax({
    url: "search.php",
    type: 'POST',
    async: false,
    contentType: 'application/json;charset=utf-8',
    dataType: 'json',
    data: JSON.stringify(myData),
    success: function (data) {//AJAX查询成功
      console.log(data);
      dataGet = data;


      if (data.status == "success") {
        //循环加入html、分页等    
        //打印文件信息和翻页信息函数
        $("#file-table").empty();
        printData(data);
        // myData=null;
      }
      if (data.status == "noData") {
        $("#file-table").empty();
        printInfo(1);
        alert("No data");
      }
      if (data.status == "fail") {
        $("#file-table").empty();
        printInfo(2);

        alert("Search Failed！");
      }}
    }
   
  );
}

function printData(data) {//打印文件信息
  var file = data.fileData;
//  console.log(file[0].Year);
  var i = 0;//返回数据中的第几个文件
  $("#file-table").append(title);
  for (var i = 0; i < 500; i++) {
      var Year = file[i].Year;
      var Title = file[i].Title;
      var Auth = file[i].Authors;
      var Key = file[i].Keywords;
      var text = '<tr id="' + i + '">' +
      '<td class="td" title="' + file[i].Year + '">' + file[i].Year+ '</td>' +
      '<td class="td" title="' + file[i].Title + '">' + file[i].Title + '</td>' +
      '<td class="td" title="' + file[i].Authors + '">' + file[i].Authors + '</td>' +
      '<td class="td" title="' + file[i].Keywords + '">' + file[i].Keywords + '</td>' +
      '</tr>';
    $("#file-table").append(text);
    $("#file-table").css("width", "80vw");
    $("#file-table").trigger("create");
    $(".th").trigger("create");
    $(".td").trigger("create");
    }
  }
function printInfo(type) {//打印错误信息
  if (type == 1) {//noData
    $("#file-table").append(title);
    $("#file-table").append('<tr ><td colspan=7>No data</td></tr>');
    $("#file-table").trigger("create");
  }
  if (type == 2) {
    $("#file-table").append(title);
    $("#file-table").append('<tr ><td colspan=7>Search failed</td></tr>');
    $("#file-table").trigger("create");
  }
  
}




function checkSubmit(event) {//禁止直接用回车提交，必须用搜索的按钮提交
  if (window.event.keyCode == 13) {
    return false;
  } else {
    return true;
  }
}