(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  if (!$('demo-chart')) return;
  const period = $('period');
  const scenario = $('scenario');
  const threshold = $('threshold');
  const thresholdLabel = $('threshold-label');
  const chart = $('demo-chart');
  let seed = 1729;
  let readings = [];
  let labels = [];

  function seededRandom(state) {
    // PRNG determinístico: muda apenas quando o usuário pede novo cenário.
    let s = state >>> 0;
    return () => {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  function generate() {
    const interval = period.value;
    const count = interval === '24' ? 49 : interval === '7' ? 57 : 61;
    const random = seededRandom(seed + count * 7919 + scenario.selectedIndex * 9287);
    const values = [];
    const times = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const waves = 4.5 * Math.sin(t * Math.PI * (interval === '24' ? 4 : 8)) + 2.5 * Math.cos(t * Math.PI * 13);
      const noise = (random() - .5) * 4;
      let moisture = 53 + waves + noise;
      if (scenario.value === 'seca') moisture -= t * 31;
      if (scenario.value === 'irrigacao') moisture = 38 + 29 * Math.exp(-((t * 4) % 1) * 2) + waves * .45 + noise;
      values.push(Math.max(12, Math.min(85, Math.round(moisture * 10) / 10)));
      if (interval === '24') times.push(`${String(Math.round(t * 24)).padStart(2, '0')}:00`);
      else times.push(`Dia ${Math.round(t * (Number(interval) - 1)) + 1}`);
    }
    readings = values;
    labels = times;
    draw();
  }

  function draw() {
    const limiar = Number(threshold.value);
    thresholdLabel.textContent = `${limiar}%`;
    const last = readings[readings.length - 1];
    const mean = readings.reduce((sum, value) => sum + value, 0) / readings.length;
    const below = readings.filter(value => value < limiar).length;
    $('latest-value').textContent = last.toFixed(1).replace('.', ',');
    $('mean-value').textContent = mean.toFixed(1).replace('.', ',');
    $('below-value').textContent = below;
    $('total-readings').textContent = readings.length;
    const state = $('scenario-state');
    state.textContent = last < limiar ? 'Abaixo do limiar' : 'Acima do limiar';
    state.classList.toggle('warning', last < limiar);
    const chartWidth = 980, chartHeight = 350;
    const left = 50, top = 14, right = 15, bottom = 15;
    const plotWidth = chartWidth - left - right, plotHeight = chartHeight - top - bottom;
    const min = 0, max = 100;
    const x = i => left + i * plotWidth / (readings.length - 1);
    const y = value => top + (max - value) * plotHeight / (max - min);
    const path = readings.map((n, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(n).toFixed(1)}`).join(' ');
    const area = `${path} L${x(readings.length - 1)},${y(min)} L${x(0)},${y(min)} Z`;
    const grids = [0, 25, 50, 75, 100].map(n => `<g><line x1="${left}" x2="${chartWidth-right}" y1="${y(n)}" y2="${y(n)}" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 5"/><text x="${left-13}" y="${y(n)+4}" text-anchor="end" fill="var(--subtle)" font-size="11" font-family="monospace">${n}%</text></g>`).join('');
    const sample = readings.length - 1;
    const dots = `<circle cx="${x(sample)}" cy="${y(last)}" r="7" fill="var(--aqua)" stroke="var(--surface)" stroke-width="4"/>`;
    chart.innerHTML = `<defs><linearGradient id="demo-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--aqua)" stop-opacity=".26"/><stop offset="1" stop-color="var(--aqua)" stop-opacity="0"/></linearGradient></defs>${grids}<path d="${area}" fill="url(#demo-fill)"/><path d="${path}" fill="none" stroke="var(--aqua)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><line x1="${left}" x2="${chartWidth-right}" y1="${y(limiar)}" y2="${y(limiar)}" stroke="#d6af69" stroke-width="2" stroke-dasharray="8 6"/>${dots}`;
    const labelsToShow = [0, .25, .5, .75, 1].map(p => labels[Math.round(p * (labels.length - 1))]);
    $('axis-labels').replaceChildren(...labelsToShow.map(label => {
      const span = document.createElement('span'); span.textContent = label; return span;
    }));
    $('chart-summary').textContent = `${readings.length} leituras simuladas · ${below} abaixo de ${limiar}% · cenário: ${scenario.options[scenario.selectedIndex].text.toLowerCase()}.`;
  }

  period.addEventListener('change', generate);
  scenario.addEventListener('change', generate);
  threshold.addEventListener('input', draw);
  $('resimulate').addEventListener('click', () => { seed += 101; generate(); });
  $('export-csv').addEventListener('click', () => {
    // A primeira linha e o nome do arquivo deixam explícita a origem simulada.
    const rows = ['periodo;umidade_simulada_percentual;limiar_demonstrativo_percentual'];
    readings.forEach((value, i) => rows.push(`${labels[i]};${String(value).replace('.', ',')};${threshold.value}`));
    const csv = '\ufeff' + rows.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `dados-simulados-umidade-${period.value}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });
  generate();
})();
