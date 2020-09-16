

var coordMatrix = [];
var todayDate  
var d = moment();
var date = d.format("MMMM Do YYYY");
var month_name = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var month = d.month();   
var year = d.year(); 
todayDate = d.format("ddd MMM DD YYYY");
var first_day = todayDate.substring(0, 3);    
var day_name = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var day_no = day_name.indexOf(first_day);   
var days = d.daysInMonth();  
var todayOfmonth = d.format("DD");
var firstdayOfmonth = day_name.indexOf(d.startOf("month").format("ddd"))
let dayOfmonth = null
    dayOfmonth = JSON.parse(localStorage.getItem("plannerDate"));
if (dayOfmonth==null) {
    dayOfmonth = todayOfmonth;
            }
        //VAR CALENDAR = get_calendar
let storedPlans = new Array(9).fill(null)
let actionRegister = new Array(9).fill(null)
    console.log(days)
let actionRegisterObj = new Array(days).fill(Array(9).fill(null))
let storedPlansObj = new Array(days).fill(Array(9).fill(null))
        $('#calendar-month-year').text(month_name[month]+" "+year);
        $('.date').append(date);

        //CITIES IN LOCAL STORAGE
        cities = JSON.parse(localStorage.getItem("storedcities"));
        if (typeof cities === "undefined" || cities === null || cities.length === null || cities.length === 0) {
            var cities = [];
            } else { 
                displaycitylist(cities,cities[0]);
            }
        $(document).on('click', '.search', searchfunction);
        function searchfunction(event) { 
            event.preventDefault();
            var input = $(".inputcity").val().trim() 
            console.log(input)
            $(".inputcity").val("")
            weatherQuery(input,todayDate,cities)
            weatherforecastQuery(input,todayDate)
            }
        $(document).on("click", ".city", choosecity);
        function choosecity(event)  {
            event.preventDefault();
            var city = $(this).attr("city-name");
            console.log(city)
            console.log("old1")
            weatherQuery(city,todayDate,cities)
            weatherforecastQuery(city,todayDate)
            };
        function displaycitylist(cities,city) {
            $(".citylist").empty()
                $.each(cities,function(key,value){ 
                var list = $("<a>");
                list.attr("href","#");
                list.attr("city-name",value);
                list.addClass("list-group-item list-group-item-action city");
                list.text(value);
                if (value===city) {
                    $('.active').removeClass('active');
                    list.toggleClass('active')
                }
                $(".citylist").append(list)
                })
        }   
        //CLOCK
        function updateTime() {
            const now = moment();
            const humanReadable = now.format("hh:mm:ssa");
            $('.clock').text(humanReadable);
        };
        setInterval(updateTime,1000);
        // API
        function weatherQuery(city,todayDate,cities) { 
        var APIKey = "9727ecf16f7e7ecee4edbad99fccd4af";
        var cityCoord = {};
        queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
            })
            .then(function(response) {
                coordMatrix = [response.coord.lat,response.coord.lon]
                city = response.name
                console.log(cities)
                console.log(city)
                if ((cities.includes(city))) { 
                    console.log("old2")
                    } else {
                        cities.unshift(city);
                        localStorage.setItem("storedcities", JSON.stringify(cities));
                    if (cities.length>15) {
                        cities.splice(-1);
                        console.log("5")
                    }
                    }
                console.log({city})
                console.log({cities})
                $(".error-message").text("").removeClass("bg-danger");
                displaycitylist(cities,city);
                weatherimagecode = response.weather[0].icon
                cityCoord[city] = coordMatrix;
                city = ""
                var imglink = "http://openweathermap.org/img/wn/" + weatherimagecode + "@2x.png" 
                var img = $("<img>");
                img.attr("src",imglink)
                $(".cityname").html(response.name + " (" + todayDate + ")");
                $(".cityname").append(img)
                $(".windspeedno").text(response.wind.speed+"MPH");
                $(".humidityno").text(response.main.humidity+"%");
                $(".tempno").html(parseInt((response.main.temp-32)*5/9)+"&degC");
                uvQuery(coordMatrix);     
            })    
            .catch(err => {   
            console.error(err.responseJSON.message);
            $(".error-message").text(err.responseJSON.message).addClass("bg-danger");
          });
        };
        function uvQuery(coord) {
        var APIKey = "9727ecf16f7e7ecee4edbad99fccd4af";
        //CONSOLE.LOG(coord)
        queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + coord[0] + "&lon=" + coord[1] + "&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
            })
            .then(function(response) {
                $(".uvindexno").text(response.value);
                if (response.value < 3) {
                    $(".uvindexno").removeClass("bg-warning bg-danger bg-success bg-violet bg-yellow")
                    $(".uvindexno").addClass("bg-success")
                } else if ( 3 <= response.value && response.value < 6) {
                    $(".uvindexno").removeClass("bg-warning bg-danger bg-success bg-violet bg-yellow")
                    $(".uvindexno").addClass("bg-yellow")
                } else if (6 <= response.value && response.value < 8) {
                    $(".uvindexno").removeClass("bg-warning bg-danger bg-success bg-violet bg-yellow")
                    $(".uvindexno").addClass("bg-warning")
                } else if (8 <= response.value && response.value < 11 ) {
                    $(".uvindexno").removeClass("bg-warning bg-danger bg-success bg-violet bg-yellow")
                    $(".uvindexno").addClass("bg-danger")
                } else {
                    $(".uvindexno").removeClass("bg-warning bg-danger bg-success bg-violet bg-yellow")
                    $(".uvindexno").addClass("bg-violet") 
                }
            });
        };
        function weatherforecastQuery(city,todayDate) { 
            var APIKey = "9727ecf16f7e7ecee4edbad99fccd4af";
            var cityCoord = {};
            queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
            $.ajax({
                url: queryURL,
                method: "GET"
                })
                .then(function(response) {
                    var weatherimagecode = [];
                    var humidity = [];
                    var temp = [];
                    for (var i = 0; i < 5; i++) {
                        var p = i + 8;
                        temp[i]=  ((response.list[p].main.temp) - 273.15).toFixed(2)
                        humidity[i]= response.list[p].main.humidity
                        weatherimagecode[i] =response.list[p].weather[0].icon
                        }
                    updateForecast(temp,humidity,weatherimagecode)
                    // Log the queryURL     
            });
        };
            function updateForecast (temp,humidity,imagecode) { 
                    $(".forecast").empty()
                for (var i = 0; i < 5; i++) {
                    var div1 = $("<div>");
                    var div2 = $("<div>");
                    var span1 =$("<span>");
                    var p1 = $("<p>");
                    var span2 =$("<span>");
                    var p2 = $("<p>");
                    var img = $("<img>");
                    var h5 = $("<h5>");             
                    var imglink = "http://openweathermap.org/img/wn/" + imagecode[i] + "@2x.png"               
                    span2.addClass("forhumidityno");
                    p2.addClass("humidity");
                    span1.addClass("fortempno");
                    p1.addClass("temp");
                    h5.addClass("card-title");
                    div2.addClass("card-body");
                    img.addClass("card-img-top");
                    div1.addClass("card bg-light text-dark");
                    img.attr("src", imglink)
                    img.attr("alt" , "weather image cap")
                    img.css({'width' : '3rem'})
                    span2.html(humidity[i]+"%");
                    span1.html(temp[i]+"&degC");
                    var date = moment().add(i , "day")
                    var dateformatted = date.format("LL")
                    h5.text(dateformatted);   
                    p2.append(span2)
                    p1.append(span1)
                    div2.append(p1).append(p2)
                    div1.append(h5).append(img).append(div2)
                    div1.css({'width': '9rem'}) 
                    $(".forecast").append(div1)
                    
                };
            };
