<template>
  <div class="hello">
    <h1>Covid-19 Statistics</h1>
    <h3>Last update: {{ lastDate }}</h3>

    <p>
      Select countries from the dropdown list to view their epidemiological evolution on the chart. The point of origin is <strong>not</strong> a cronological date,
      but the day each country got infected (apart from China, whose "day 0" is unknown). This approach allows us to compare the emergency response of countries
      and determine how well they performed on "day X from the first infection" in relation to others.
    </p>
    <p>Data is retrieved manually from the <a href="https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide">European CDC</a></p>
  
    <GChart
      type="LineChart"
      :data="chartData"
      :options="chartOptions"
    />

    <div class="select">
      <label class="typo__label">Countries & territories</label>
      <multiselect v-model="selected" :options="countries" :multiple="true" :close-on-select="false" :clear-on-select="true" 
      :preserve-search="true" placeholder="Select countries" label="name" track-by="name" :preselect-first="true">
      </multiselect>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Statistics',

  props: {
  },

  data() { 
    return {
      countries: [],
      lastDate: '',
      chartData: [],
      chartOptions: {
        chartArea: {
          right: "12%",
        },
        hAxis: {
          title: 'Days since first infection'
        },
        vAxis: {
          title: 'Number of daily new cases'
        },
      },
      chart: {},
      selected: [],
    }
  },

  computed: {
      showCountries() {
        return this.selected.map(country => country['name']);
      },
  },

  watch: {
    showCountries(newValue) {
      for (let i = 0; i < this.countries.length; i++) {
        if (newValue.includes(this.countries[i].name)) {
          this.countries[i]['show'] = true;
        } else {
          this.countries[i]['show'] = false;
        }
      }

      this.updateChart();
    }
  },

  mounted() {
    const axios = require('axios');

    // Make a request for a user with a given ID
    axios.get('data.json')
      .then(function (response) {
        // handle success
        this.parseData(response.data);
      }.bind(this))
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  },

  methods: {
    parseData: function (data) {
      let currentCountry = '';
      let day = 0;
      let countriesCounter = -1;

      for (let i = data.length - 1; i >= 0; i--) {
        let record = data[i];

        if (record['Countries and territories'].toLowerCase() != currentCountry.toLowerCase()) {
          currentCountry = record['Countries and territories'];
          currentCountry = currentCountry.charAt(0).toUpperCase() + currentCountry.slice(1).toLowerCase();
          day = 0;
          countriesCounter++;

          this.countries[countriesCounter] = {
            'name': currentCountry,
            'cases': [],
            'startDate': record['DateRep'],
            'show': this.showCountries.includes(currentCountry) ? true : false,
          };

          if (currentCountry == 'Denmark') {
            this.selected = [this.countries[countriesCounter]];
          }
        }

        if (day > 0 || record['Cases'] > 0) {
          this.countries[countriesCounter]['cases'][day] = record['Cases'];
          day++;
        }
      }

      this.lastDate = data[0]['DateRep'];

      this.countries = this.countries.reverse();

      console.log(this.countries);

      this.updateChart();
    },

    updateChart: function() {
      this.chartData = [];
      this.chartData[0] = [];
      this.chartData[0][0] = 'Day';
      for (let i = 0, chartCounter = 1; i < this.countries.length; i++, chartCounter++) {
        if (!this.countries[i]['show']) {
          chartCounter--;
          continue;
        }
        this.chartData[0][chartCounter] = this.countries[i]['name'];
      }

      for (let i = 1; ; i++) {
        let stop = true;
        this.chartData[i] = [];
        this.chartData[i][0] = i - 1;
        for (let j = 0, chartCounter = 1; j < this.countries.length; j++, chartCounter++) {
          if (!this.countries[j]['show']) {
            chartCounter--;
            continue;
          }
          if (this.countries[j]['cases'].length > i - 1) {
            this.chartData[i][chartCounter] = this.countries[j]['cases'][i - 1];
            stop = false;
          } else {
            this.chartData[i][chartCounter] = "_";
          }
        }
        if (stop) {
          break;
        }
      }

      console.log(this.chartData);
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.select {
  margin-top: 3em;
}
</style>
