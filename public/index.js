const apiKey = '67657a435c4e422790c2e1c48d95829e';

function getColor(stock) {
  if (stock === 'GME') {
    return 'rgba(61, 161, 61, 0.7)';
  }
  if (stock === 'MSFT') {
    return 'rgba(209, 4, 25, 0.7)';
  }
  if (stock === 'DIS') {
    return 'rgba(18, 4, 209, 0.7)';
  }
  if (stock === 'BNTX') {
    return 'rgba(166, 43, 158, 0.7)';
  }
}

function highestPrice(values) {
  let highest = 0;
  values.forEach(value => {
    if (parseFloat(value.high) > highest) {
      highest = value.high;
    }
  });
  return highest;
}

function averagePrice(values) {
  let total = 0;
  values.forEach(value => {
    total += parseFloat(value.high);
  });
  return total / values.length;
}

async function main() {
  const timeChartCanvas = document.querySelector('#time-chart');
  const highestPriceChartCanvas = document.querySelector(
    '#highest-price-chart'
  );
  const averagePriceChartCanvas = document.querySelector(
    '#average-price-chart'
  );

  const response = await fetch(
    `https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=${apiKey}`
  );

  const result = await response.json();

  const { GME, MSFT, DIS, BNTX } = result;
  const stocks = [GME, MSFT, DIS, BNTX];

  new Chart(timeChartCanvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: stocks[0].values.reverse().map(value => value.datetime),
      datasets: stocks.map(stock => ({
        label: stock.meta.symbol,
        data: stock.values.map(value => parseFloat(value.high)),
        backgroundColor: getColor(stock.meta.symbol),
        borderColor: getColor(stock.meta.symbol),
      })),
    },
  });

  new Chart(highestPriceChartCanvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: stocks.map(stock => stock.meta.symbol),
      datasets: [
        {
          label: 'Highest',
          backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
          borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
          data: stocks.map(stock => highestPrice(stock.values)),
        },
      ],
    },
  });

  new Chart(averagePriceChartCanvas.getContext('2d'), {
    type: 'pie',
    data: {
      labels: stocks.map(stock => stock.meta.symbol),
      datasets: [
        {
          label: 'Average',
          backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
          borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
          data: stocks.map(stock => averagePrice(stock.values)),
        },
      ],
    },
  });
}
main();
