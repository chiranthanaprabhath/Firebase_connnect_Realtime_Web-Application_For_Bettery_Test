        // Your web app's Firebase configuration
        var startsoc = 100;

        document.cookie = "startsoc=" + startsoc + ";";
        var firebaseConfig = {
            apiKey: "AIzaSyB_N4gMHf1BrJpa2KsWqedPIH6hRe7W4YY",
            authDomain: "data-ad105.firebaseapp.com",
            databaseURL: "https://data-ad105.firebaseio.com",
            projectId: "data-ad105",
            storageBucket: "",
            messagingSenderId: "247957285740",
            appId: "1:247957285740:web:8179a6345329a72dfca149",
            measurementId: "G-ZRTC3D3V7P"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        var ref = firebase.database().ref();
        function updateData() {

            ref.on("value", function (snapshot) {
                var obj = JSON.parse(JSON.stringify(snapshot.val(), null, 2));
                passCCTValues();
                passValues();
                passOCTValues();
                dataCal(obj);
            });
        }
        updateData();
        setInterval(updateData, 3000);
        function dataCal(obj) {
            var lastObject = Object.keys(obj)[Object.keys(obj).length - 1];
            var ivalue = document.getElementById("ivalue").value;
            var tvalue = document.getElementById("tvalue").value;
            var rcvalue = document.getElementById("rcvalue").value;
            document.getElementById("rc").value = 0.2 * (Number)(ivalue) * (Number)(tvalue);
            var ratedC = 0.2 * (Number)(ivalue) * (Number)(tvalue);
            var sohvalue=0.2 * (Number)(ivalue) * (Number)(tvalue) / (Number)(rcvalue);
            document.getElementById("soh").value = 0.2 * (Number)(ivalue) * (Number)(tvalue) / (Number)(rcvalue);
            document.getElementById("rc2").value = ratedC;
            document.getElementById("rca").value = ratedC;
            document.getElementById("sohe").value = sohvalue;
            setlist(obj[lastObject]);
            var lastObjectData = obj[lastObject][Object.keys(obj[lastObject])[Object.keys(obj[lastObject]).length - 1]];
            var startTime = Object.keys(obj[lastObject])[0];
            var endTime = lastObjectData.Time;
            console.log(lastObjectData.Temperature);
            document.getElementById("temvalue").value = lastObjectData.Temperature;
            document.getElementById("datevalue").value = new Date().toISOString().slice(0, 10);;
            document.getElementById("timevalue").value = endTime;
            document.cookie = "endsavetime=" + endTime + ";";
            var timedeff = (hmsToSeconds(endTime) - hmsToSeconds(getCookie("endsavetime")));
            if (getCookie("startsoc") == 100) {
                console.log("First TIme")
                var timedeff = (hmsToSeconds(endTime) - hmsToSeconds(startTime));
            }
    
            var cooksoc = getCookie("startsoc");

            console.log(startTime, endTime, timedeff, getCookie("endsavetime"), getCookie("startsoc"));
            if (document.getElementById("myRadio3").checked) {
                var chargingflag=1;
                console.log('charging');
                document.getElementById("soc").value = getCookie("startsoc") + lastObjectData.Current * timedeff / ratedC;;
                document.cookie = "startsoc=" + getCookie("startsoc") - lastObjectData.Current * timedeff / ratedC + ";";
            }
            if (document.getElementById("myRadio4").checked) {
                var chargingflag=0;
                console.log('discharging');
                document.getElementById("soc").value = getCookie("startsoc") - lastObjectData.Current * timedeff / ratedC;
                document.cookie = "startsoc=" + getCookie("startsoc") - lastObjectData.Current * timedeff / ratedC + ";";
            }

            var newsoc = document.getElementById("soc").value;
            var cooksoc = getCookie("startsoc");
            
            if (localStorage.getItem("cycles") === null) {
                var cycles= 0;
                localStorage.setItem("cycles", 0);
            }
            if (newsoc > cooksoc) {
                var chargingflag = localStorage.getItem("charging");
                if (chargingflag == 0) {
                    var chargingflag=1;
                    var a = localStorage.getItem("cycles");
                    cycles=cycles+0.5;
                }
            } else {
                var chargingflag = localStorage.getItem("charging");
                if (chargingflag == 1) {
                    var chargingflag=0;
                    if (cooksoc <= 60) {
                        var eoc=cycles;
                        document.getElementById("enocy").value = eoc;
                        document.getElementById("enc").value = eoc;
                        cycles=0;
                    } else {
                        cycles=cycles+0.5;;
                    }
                }
            }
        }
        function setlist(lastObject) {
            var i;
            var chatdata=[
                ['Time', 'Voltage', 'Current'],
              ]
            for (i = 0; i < Object.keys(lastObject).length; i++) {
                var ObjectData = lastObject[Object.keys(lastObject)[i]];
                if(ObjectData.Voltage<25 && ObjectData.Current<20 && ObjectData.Voltage>-25 && ObjectData.Current>-20){
                    chatdata.push([ObjectData.Time,ObjectData.Voltage,ObjectData.Current])
                }
            }
            console.log("new",chatdata)
            drawchat(chatdata)
        }
        function hmsToSeconds(s) {
            var b = s.split(':');
            return b[0] * 3600 + b[1] * 60 + (+b[2] || 0);
        }
        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
        ////////////////////////////////////////////////////HCARTTTTTT
        function drawchat(chatdata){
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);
      
            function drawChart() {
              var data = google.visualization.arrayToDataTable(chatdata);
      
              var options = {
                title: 'Current and Voltage Change with Time',
                curveType: 'function',
                legend: { position: 'bottom' }
              };
      
              var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
      
              chart.draw(data, options);
            }
        }
        ///////////////////////////////////hvbh
        function passValues() {
            var f = document.getElementById("no1");
            var g = document.getElementById("no2");
            var h = document.getElementById("no3");
            if (f.checked && g.checked && h.checked) {
                document.getElementById("sct").innerHTML = "The battery could withstand a short circuit condition. Therefore the battery is upto the standard conditions.";
            } else {
                document.getElementById("sct").innerHTML = "The battery couldn't withstand a short circuit condition. Therefore the battery is not upto the standard.";
            }
            return false;
        }


        function passOCTValues() {
            var a = document.getElementById("n1");
            var b = document.getElementById("n2");
            if (a.checked && b.checked) {
                document.getElementById("oct").innerHTML = "The battery could withstand a charger malfunction where the upper voltage is only limited by the charger. Therefore the battery is upto the standard level.";
            } else {
                document.getElementById("oct").innerHTML = "The battery couldn't withstand a charger malfunction where the upper voltage is only limited by the charger. Therefore the battery is not upto the standard level.";
            }
            return false;
        }

        

        function passCCTValues() {
            var f = document.getElementById("n11");
            var g = document.getElementById("n22");
            var h = document.getElementById("n33");
            if (f.checked && g.checked && h.checked) {
                document.getElementById("cct").innerHTML = "The battery could withstand a continuous charging for an extended time period. Therefore the battery is upto the standard.";
            } else {
                document.getElementById("cct").innerHTML = "The battery couldn't withstand a continuous charging for an extended time period.Therefore the battery is not upto the standard.";

            }
            return false;
        }