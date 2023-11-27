// Read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Fetch the JSON data 
d3.json(url).then((data) => {
    console.log("Data: ", data);
});
// Initialize
function init() {
    // Use D3 to select the dropdown menu
    let dropdown = d3.select("#selDataset");
        //Use D3 to get data
        d3.json(url).then((data) => {
            //set variable for names
            let idnames = data.names; 
            console.log("DropDownList: ", idnames);
            //append to add names to the drop down list
            idnames.forEach((id) => {
                dropdown.append("option").text(id).property("value",id);
                });
            //Set name as the first index of the array
            let first_idname = idnames[0];
            console.log("First ID Name: ",first_idname);
            
            //create the inital charts
            plothbar(first_idname);
            plotbubblechart(first_idname);
            plotmetadata(first_idname) 
        });
    };
    //Create the bar chart
    function plothbar(sample) {
        //User D3 to get data
        d3.json(url).then((data) => {
            //set variable to samples
            let samples_data = data.samples;
            console.log("Samples Data: ",samples_data)
            //filter sample to id
            let selectedids = samples_data.filter((id) => id.id == sample);
            console.log("Selected IDs: ",selectedids)
            //set the id as the first index of the array
            let first_result = selectedids[0];
            console.log("First Result: ",first_result)
            //get the top 10 sales value, otu_ids and otu lobels
            let sample_values = first_result.sample_values.slice(0,10).reverse();
            console.log("Sample Values(Bar): ", sample_values);
            let otu_ids = first_result.otu_ids.slice(0,10).reverse();
            console.log("otu_ids(Bar): ", otu_ids);
            let otu_labels = first_result.otu_labels.slice(0,10).reverse();
            console.log("otu.labels(Bar): ",otu_labels);
        
        //Plot horizontal bar chart
        let trace_bar = {
            x: sample_values,
            y: otu_ids.map((otu_id) => `OTU ${otu_id}`),
            text: otu_labels,
            type: 'bar',
            orientation: 'h'
        };
        let layout = {title: "Top 10 OTUs"};
        Plotly.newPlot("bar",[trace_bar], layout);    
        })
    }

    function plotbubblechart(sample) {
        d3.json(url).then((data) => {
            //set variable to samples
            let samples_data = data.samples;
            console.log("Samples Data: ",samples_data)
            //filter sample to id
            let selectedids = samples_data.filter((id) => id.id == sample);
            console.log("Selected IDs: ",selectedids)
            //set the id as the first index of the array
            let first_result = selectedids[0];
            console.log("First Result: ",first_result)
        
            //get the top 10 sales value, otu_ids and otu lobels
            let sample_values = first_result.sample_values.slice(0,10);
            console.log("Sample Values(Bubble): ", sample_values);
            let otu_ids = first_result.otu_ids.slice(0,10);
            console.log("otu_ids(Bubble): ", otu_ids);
            let otu_labels = first_result.otu_labels.slice(0,10)
            console.log("otu.labels(Bubble): ",otu_labels);

            //Plot bublle chart
            let trace_bubble = {
                x: otu_ids.reverse(),
                y: sample_values.reverse(),
                text: otu_labels.reverse(),
                mode: 'markers',
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
           }
           let layout = {
            title: "Top 10 OTUs Bacteria",
            xaxis: {title: "OTD ID"},
            yaxis: {title: "Number of Bacteria"}
            };
            Plotly.newPlot("bubble",[trace_bubble],layout);
        });
    }

    function plotmetadata(sample) {
        d3.json(url).then((data) => {
            //set variable to samples
            let demographics_data = data.metadata;
            console.log("Demographics: ",demographics_data)
            //filter sample to id
            let selectedids = demographics_data.filter((id) => id.id == sample);
            console.log("Selected IDs(Demographics): ",selectedids)
            //set the id as the first index of the array
            let first_result = selectedids[0];
            console.log("First Result(Demographics): ",first_result)
        
            //get and store the meta data in the Demographic Info 
            Object.entries(first_result).forEach(([key,value]) =>{
                console.log(key,value);
            let demographicsid = d3.select('#sample-metadata');

            //Display the demogrphic information
            demographicsid.html (
                `ID: ${first_result.id} <br>
                Ethnicity: ${first_result.ethnicity} <br>
                Genter: ${first_result.gender} <br>
                Age: ${first_result.age} <br>
                Location: ${first_result.location} <br>
                bbtype: ${first_result.bbtype} <br>
                wFreq: ${first_result.wfreq} <br> `
            );
            });

        });
    }
    //Funcion that updates the charts and demographic info according to the selected id
    function optionChanged(value) {
        console.log("value: ",value);
        plothbar(value);
        plotbubblechart(value);
        plotmetadata(value);
    };

init();

