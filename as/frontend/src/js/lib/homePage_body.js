$(document).ready(function() {

    //定义传递给feature部分的参数
    var featureData = {
        liClass: ["feature-one", "feature-two", "feature-three", "feature-four"],
        liId:["id1","id2","id3","id4"],
        imgSrc: ["../images/1.jpg", "../images/2.jpg", "../images/3.jpg", "../images/4.jpg"],
        imgClass: "feature_pic",
        //separateLine:"",
        titleClass: "feature_title",
        contentClass: "feature_content",
        hrefList:""
    }

    //使用百度模板，建立feature部分的Html
    var bt1 = baidu.template;
    var feature_html = bt1("template1", featureData);
    $("div.feature").html(feature_html);
    $(".feature-one").find("h2").html("特点一");
    $(".feature-one").find("p").html("特点一特点一特点一特点一特点一特点一特点一特点一特点一" +
    "特点一点一");

    $(".feature-two").find("h2").html("特点一");
    $(".feature-two").find("p").html("特点一特点一特点一特点一特点一特点一特点一特点一特点一" +
    "特一");

    $(".feature-three").find("h2").html("特点一");
    $(".feature-three").find("p").html("特点一特点一特点一特点一特点一特点一特点一特点一特点一" +
    "特");

    $(".feature-four").find("h2").html("特点一");
    $(".feature-four").find("p").html("特点一特点一特点一特点一特点一特点一特点一特点一特点一" +
    "特点一一");

    //传递给sectionCourse部分的参数
    var sectionCourseData = {
        liClass:["InterCourse","AmericanTour","AmericanCompete"],
        liId:["id1","id2","id3"],
        imgSrc: ["../images/1.jpg", "../images/2.jpg", "../images/3.jpg"],
        imgClass: "sectionCourse_pic",
        //separateLine:"../images/rule-dots.png",
        titleClass: "sectionCourse_title",
        contentClass: "sectionCourse_content",
        hrefList:["#","#","#"]
    }

    //使用百度模板，建立sectionCourse部分的Html
    var bt2 = baidu.template;
    var sectionCourse_html = bt2("template1", sectionCourseData);
    $("div.sectionCourse").html(sectionCourse_html);

    $(".InterCourse").find("h2").html("国际课程");
    $(".InterCourse").find("p").html("国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国" +
    "际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国" +
    "际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际课程国际" +
    "课程国际课程国际课程国际课程国际课程国际课程");

    $(".AmericanTour").find("h2").html("美国游学");
    $(".AmericanTour").find("p").html("美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美" +
    "国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游" +
    "学美国游学美国游学美国游学美国游学美国游学美国游学美国游学");

    $(".AmericanCompete").find("h2").html("美国赛事");
    $(".AmericanCompete").find("p").html("美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美" +
    "国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游学美国游" +
    "学美国游学美国游学美国游学美国游学美国游学美国游学美国游学学美国游学美国游学美国游学美国游学美国游学");
});