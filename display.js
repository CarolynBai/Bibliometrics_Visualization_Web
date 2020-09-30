const api = 'keyword.json';
const width = 1000;
const height = 500;

var vis = d3.select("#visualisation"),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

d3.json(api, (error, dataset) => {
    if (error) {
        return console.error(error);
    }
    var datause = dataset.nodes;

    // 初始化
    setTimeout(function () { 
        initalize(datause);
       

    }, 10);
});

//Ajax
function send(){
    myData  = {year:2019,keyword:"byn"}
    $.ajax({//这个ajax可以在点击某个地方的时候触发
            url: "./display.php",//url 对应的php文件的相对路径
            type: 'POST', //这个不用改
            async: false,//不变
            contentType: 'application/json;charset=utf-8',//不变
            dataType: 'json',//不变 
            data: JSON.stringify(myData),//这里的mydata就是前端请求的内容比如：{page：“1” type：“1”  keyword：“byn”  year：“2020”}这就是前端发给php的json 最好写一个函数组织好这个json
            
            success: function (data) {//AJAX查询成功的函数，这里的data（可以随便命名的）就是php受到以后返回的json
              console.log(data);//这是把内容打印在浏览器
             
            },
            error: function (data) {//这是查询出错的时候的操作
              console.log(data);
             
              alert("请求失败!");
            }
          }
          );
    }

// 初始化
function initalize(dataset) {

    // xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([2000, 2020]),
    //     yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 20]),
    var maxYear = Number(d3.max(dataset, function (d) { return d.year; }));

    var minYear = Number(d3.min(dataset, function (d) { return d.year; }));

    var maxOccur = Number(d3.max(dataset, function (d) { return d.occurence; }));

    var minOccur = Number(d3.min(dataset, function (d) { return d.occurence; }));

    // console.log(maxYear, minYear);
    // console.log(maxOccur, minOccur);
    var xScale = d3.scale.linear()

        .domain([minYear-2, maxYear+2])
        .range([MARGINS.left, WIDTH - MARGINS.right])
        ;

    var yScale = d3.scale.linear()

        .domain([0, maxOccur + 15])
        .range([HEIGHT - MARGINS.top, MARGINS.bottom]);


    xAxis = d3.svg.axis()
        .ticks(10)
        .tickFormat(Number)
        .scale(xScale),

        yAxis = d3.svg.axis()
            .ticks(10)
            .tickFormat(Number)
            .scale(yScale);


    vis.append("svg:g")
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    vis.append("svg:g")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .attr('stroke', 'cyan')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .call(yAxis);



    // 选择线条的类型

    // 添加path元素，并通过lineGen()计算出值来赋值
    var lineGen = d3.svg.line()
        .x(function (d) {
            // console.log(d.year);
            return xScale(d.year)
        })
        .y(function (d) {
            // console.log(d.occurence)
            return yScale(d.occurence);

        })
        .interpolate('cardinal');


    vis.append('svg:path')
        .attr('class', 'line')
        .attr('d', lineGen(dataset))
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
    //加入坐标点

    var div = d3.select('body').append('div')   	//添加鼠标停留提示框
        .attr('class', 'd3-tip')
        .attr('cx', lineGen.x() + 5)
        .attr('cy', lineGen.y() - 5)
        .style('opacity', 0)


    var g = vis.selectAll('circle')
        .data(dataset)
        .enter()
        .append('g')
        .append('circle')
        .attr('class', 'linecircle')
        .attr('cx', lineGen.x())
        .attr('cy', lineGen.y())
        .attr('r', 4.5)
        .text('123')
        .on('mouseover', function () {
            d3.select(this).transition().duration(500).attr('r', 9);
            d3.select(this).attr("fill", "cyan");


            console.log(d3.select(this).data()[0].year)
            // d3.select('.tips')
            // d3.select('.tips').style('display', 'block');


            div.transition()
                .duration(800)
                .style('opacity', .7)
                .style("display", "flex");

            div.html("<span id ='tip0' style='color:blue text-align: center;'>Details </span>" +
                "<span id='tip1'style='color:blue'>Keyword:" + d3.select(this).data()[0].keyword + " </span>" +
                "</span><span id = tip3 style='color: blue'>  Year:" + d3.select(this).data()[0].year + "</span>") 				//提示框的内容
                .style('left', (parseInt(d3.event.path[0].attributes[1].nodeValue) + 10) + 'px')  //提示框的位置
                .style('top', (parseInt(d3.event.path[0].attributes[2].nodeValue) +300) + 'px')
            // .attr('cx', lineGen.x())   //提示框的位置
            // .attr('cy', lineGen.y())    d3.event.path[0].attributes[3].nodeValue

        })
        .on('mouseout', function () {
            d3.select(this).transition().duration(500).attr('r', 4.5);
            d3.select(this).attr("fill", "lightblue")
            div.transition()
                .style('opacity', 0)
                .style("display", "none")

        })
        ;


    
}



