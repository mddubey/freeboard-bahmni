(function () {
    freeboard.loadDatasourcePlugin({
        "type_name": "bahmni_json_reports",
        "display_name": "Bahmni JSON Reports",
        "description": "This plugin will fetch bahmni reports data in json format",
        "external_scripts": [""],
        "settings": [
            {
                "name": "base_url",
                "display_name": "Base URL",
                "description": "Bahmni Base URL, e.g.:- https://demo.mybahmni.org/",
                "type": "text",
                "required": true
            },
            {
                "name": "username",
                "display_name": "Username",
                "description": "Username for bahmni having reports API access",
                "type": "text",
                "required": true
            },
            {
                "name": "password",
                "display_name": "Password",
                "description": "Password for bahmni",
                "type": "text",
                "required": true
            },
            {
                "name": "report_name",
                "display_name": "Report Name",
                "description": "The Bahmni Report name",
                "type": "text",
                "required": true
            },
            {
                "name": "period_value",
                "display_name": "For Last",
                "description": "Period for which data has to be fetched. Put a number",
                "type": "number",
                "required": true
            },
            {
                "name"        : "period",
                "display_name": "Period",
                "type"        : "option",
                "required": true,
                "options"     : [
                    {
                        "name" : "Day(s)",
                        "value": "day"
                    },
                    {
                        "name" : "Year(s)",
                        "value": "year"
                    },
                    {
                        "name" : "Month(s)",
                        "value": "month"
                    }
                ]
            },
        ],
        // **newInstance(settings, newInstanceCallback, updateCallback)** (required) : A function that will be called when a new instance of this plugin is requested.
        // * **settings** : A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
        // * **newInstanceCallback** : A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
        // * **updateCallback** : A callback function that you'll call if and when your datasource has an update for freeboard to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.
        newInstance: function (settings, newInstanceCallback, updateCallback) {
            newInstanceCallback(new myDatasourcePlugin(settings, updateCallback));
        }
    });


    var myDatasourcePlugin = function (settings, updateCallback) {
        var self = this;
        var currentSettings = settings;

        function getData() {
            var loginUrlFormat = "{BASE}/openmrs/ms/legacyui/loginServlet";
            var loginURL = loginUrlFormat.replace("{BASE}", currentSettings.base_url);
                            
            var formatDate = function(date){
                return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
            }

            var calculateStartDate = function(currentSettings){
                var today = new Date();
                if (currentSettings["period"] === 'day') {
                    today.setDate(today.getDate()-currentSettings["period_value"])
                    return today;
                }
                if(currentSettings["period"] === 'month'){
                    today.setMonth(today.getMonth()-currentSettings["period_value"])
                    return today;  
                }
                if(currentSettings["period"] === 'year'){
                    today.setFullYear(today.getFullYear()-currentSettings["period_value"])
                    return today;
                }
            }

            var onSuccessfulLogin = function (data, status, xhr) {
                console.log("Logged in");
                var reportURL = '{BASE}/bahmnireports/report';

                var data = {};
                data["name"] = currentSettings["report_name"];
                data["responseType"] = "application/json"

                data["startDate"] = formatDate(calculateStartDate(currentSettings));
                data["endDate"] = formatDate(new Date());
                console.log("Fetching data from "+data["startDate"] + " to " + data["endDate"]);

                reportURL = reportURL.replace("{BASE}", currentSettings.base_url);
                jQuery.ajax({
                    url: reportURL,
                    type: 'GET',
                    data: data,
                    success: function (data) {
                        updateCallback(data);
                    },
                    error: function (xhr, status) {
                        console.log("Fetch Failed", xhr)
                    }
                })

            };
            jQuery.ajax({
                url: loginURL,
                type: "POST",
                data: {uname: currentSettings.username, pw: currentSettings.password},
                success: onSuccessfulLogin,
                error: function (xhr, status, error) {
                    console.log("Login Failed", xhr)
                }
            });
        }

        self.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
        }

        self.updateNow = function () {
            getData();
        }

        self.onDispose = function () {
        }
    }
}());