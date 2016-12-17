function renderInitialGraph(map) {
    var ctx = $("#myChart");
    var label =[],data = [];
    for ( var key in map){
        label.push(key);
        data.push(map[key]);
    }
    var data = {
        labels: label,
        datasets: [
            {
                label: "Violations",
                fill: true,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data,
                spanGaps: false,
            }
        ]
    };
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data
    });
}


$(document).ready(function () {
    jQuery(function(){
        jQuery('#date_timepicker_start').datetimepicker({
            format:'Y/m/d',
            onShow:function( ct ){
                this.setOptions({
                    maxDate:jQuery('#date_timepicker_end').val()?jQuery('#date_timepicker_end').val():false
                })
            },
            timepicker:false
        });
        jQuery('#date_timepicker_end').datetimepicker({
            format:'Y/m/d',
            onShow:function( ct ){
                this.setOptions({
                    minDate:jQuery('#date_timepicker_start').val()?jQuery('#date_timepicker_start').val():false
                })
            },
            timepicker:false
        });
    });


    $('#cal_submit').on('click',function () {
        var start = $('#date_timepicker_start').val();
        var end = $('#date_timepicker_end').val();
        console.log(start);
        console.log(end);
        $.ajax({
            url : 'http://localhost:3000/graph',
            method : 'POST',
            jsonp : true,
            data: {start : start, end : end},
            success : function (res) {
                console.log(res);
                renderInitialGraph(res);
            },
            error : function (xhr) {
                console.log(xhr);
            }
        });
    });
    $.ajax({
        url : 'http://localhost:3000/graph',
        method : 'POST',
        jsonp : true,
        data: {start : '12/11/2016', end : '12/11/2016'},
        success : function (res) {
            console.log(res);
            renderInitialGraph(res);
        },
        error : function (xhr) {
            console.log(xhr);
        }
    });
    $.ajax({
        url : 'http://localhost:3000/graph/summery',
        method : 'POST',
        jsonp : true,
        // data: {start : '10/10/2016', end : '12/11/2016'},
        success : function (res) {
            console.log(res);
            // renderInitialGraph();
            var day = [];
            for ( var key in res.day_map ){
                if(key < 7)
                    day[key] = res.day_map[key];
            }
            var week = $('#week');
            var data = {
                labels: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                datasets: [
                    {
                        label: "Violations on days ",
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1,
                        data: day,
                    }
                ]
            };
            var myBarChart = new Chart(week, {
                type: 'bar',
                data: data
            });
        },
        error : function (xhr) {
            console.log(xhr);
        }
    });
    $.ajax({
        url : 'http://localhost:3000/graph/current',
        method : 'POST',
        success : function (data) {
            var $tBody = $('#tab');
            console.log(data);
            data.forEach(function (curr) {
                console.log(curr);
                curr.violations.forEach(function (voi) {
                    var toAppend = `<tr data-id = '${data._id}'>
                         <td>${curr.name}</td>
                         <td>${curr.carId}</td>
                        <td>${voi.registeredOn}</td>
                        </tr>`;
                    $tBody.html(toAppend + $tBody.html());

                });
            });



        }
    })

});