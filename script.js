document.addEventListener('DOMContentLoaded', () => {
    let allData = [];
    let charts = {};

    // Use TextDecoder to handle special characters like 'Ñ' by specifying the encoding.
    Papa.parse('delitos.csv', {
        download: true,
        header: true,
        complete: function(results) {
            // Papa Parse ya maneja la codificación y el parseo de líneas/columnas
            allData = results.data.map(row => ({
                comunidad: row.comunidad.trim(),
                tipologia: row.tipologia.trim(),
                periodo: parseInt(row.periodo),
                total: parseInt(row.total.replace(/\./g, '')) || 0
            })).filter(d => d.periodo && d.total);

            populateFilters(allData);
            initializeCharts(allData);

            document.getElementById('comunidad-filter').addEventListener('change', () => updateCharts(allData));
            document.getElementById('tipologia-filter').addEventListener('change', () => updateCharts(allData));
            document.getElementById('anio-filter').addEventListener('change', () => updateCharts(allData));
            document.getElementById('reset-filters').addEventListener('click', () => {
                document.getElementById('comunidad-filter').value = 'TOTAL NACIONAL';
                document.getElementById('tipologia-filter').value = 'Todos';
                document.getElementById('anio-filter').value = 'Todos';
                updateCharts(allData);
            });
        }
    });

    function populateFilters(data) {
        const comunidadFilter = document.getElementById('comunidad-filter');
        const tipologiaFilter = document.getElementById('tipologia-filter');
        const anioFilter = document.getElementById('anio-filter');

        const comunidades = ['TOTAL NACIONAL', ...new Set(data.map(d => d.comunidad).filter(c => c !== 'TOTAL NACIONAL').sort())];
        const tipologias = ['Todos', ...new Set(data.map(d => d.tipologia).sort())];
        const anios = ['Todos', ...new Set(data.map(d => d.periodo).sort((a, b) => b - a))];

        comunidadFilter.innerHTML = ''; // Limpiar opciones existentes
        tipologiaFilter.innerHTML = ''; // Limpiar opciones existentes
        anioFilter.innerHTML = ''; // Limpiar opciones existentes

        comunidades.forEach(c => comunidadFilter.innerHTML += `<option value="${c}">${c}</option>`);
        tipologias.forEach(t => tipologiaFilter.innerHTML += `<option value="${t}">${t}</option>`);
        anios.forEach(a => anioFilter.innerHTML += `<option value="${a}">${a}</option>`);
    }

    function initializeCharts(data) {
        charts.evolucionDelitos = createChart('evolucionDelitos', 'line');
        charts.totalDelitosPorComunidad = createChart('totalDelitosPorComunidad', 'bar', { indexAxis: 'y' });
        charts.distribucionDelitos = createChart('distribucionDelitos', 'pie');
        charts.evolucionPrincipalesDelitos = createChart('evolucionPrincipalesDelitos', 'line');
        updateCharts(data);
        updateTop5Chart(data); // This one doesn't update with filters
    }

    function updateCharts(data) {
        const selectedComunidad = document.getElementById('comunidad-filter').value;
        const selectedTipologia = document.getElementById('tipologia-filter').value;
        const selectedAnio = document.getElementById('anio-filter').value;

        let filteredData = data;
        if (selectedComunidad !== 'Todos') {
            filteredData = filteredData.filter(d => d.comunidad === selectedComunidad);
        }
        if (selectedTipologia !== 'Todos') {
            filteredData = filteredData.filter(d => d.tipologia === selectedTipologia);
        }
        if (selectedAnio !== 'Todos') {
            filteredData = filteredData.filter(d => d.periodo == selectedAnio);
        }

        updateEvolucionDelitos(filteredData, selectedComunidad, selectedTipologia);
        updateTotalDelitosPorComunidad(data, selectedTipologia, selectedAnio);
        updateDistribucionDelitos(data, selectedComunidad, selectedAnio);
    }

    function updateEvolucionDelitos(data, comunidad, tipologia) {
        const evolutionData = data.reduce((acc, d) => {
            if (tipologia === 'Todos') {
                 const key = d.periodo;
                 acc[key] = (acc[key] || 0) + d.total;
            } else {
                if(d.tipologia === tipologia) {
                    acc[d.periodo] = d.total;
                }
            }
            return acc;
        }, {});

        const chart = charts.evolucionDelitos;
        chart.data.labels = Object.keys(evolutionData).sort();
        chart.data.datasets[0] = {
            label: `${tipologia} en ${comunidad}`,
            data: Object.values(evolutionData),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        };
        chart.update();
    }

    function updateTotalDelitosPorComunidad(data, tipologia, anio) {
        let filtered = data.filter(d => d.comunidad !== 'TOTAL NACIONAL');
        if (tipologia !== 'Todos') filtered = filtered.filter(d => d.tipologia === tipologia);
        if (anio !== 'Todos') filtered = filtered.filter(d => d.periodo == anio);

        const communityData = filtered.reduce((acc, d) => {
            acc[d.comunidad] = (acc[d.comunidad] || 0) + d.total;
            return acc;
        }, {});

        const chart = charts.totalDelitosPorComunidad;
        const sortedCommunities = Object.entries(communityData).sort((a,b) => a[1] - b[1]);
        
        chart.data.labels = sortedCommunities.map(c => c[0]);
        chart.data.datasets[0] = {
            label: `Total Delitos (${tipologia}, ${anio})`,
            data: sortedCommunities.map(c => c[1]),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
        };
        chart.update();
    }

    function updateDistribucionDelitos(data, comunidad, anio) {
        let filtered = data;
        if (comunidad !== 'Todos') filtered = filtered.filter(d => d.comunidad === comunidad);
        if (anio !== 'Todos') filtered = filtered.filter(d => d.periodo == anio);

        const distributionData = filtered.reduce((acc, d) => {
            acc[d.tipologia] = (acc[d.tipologia] || 0) + d.total;
            return acc;
        }, {});

        const chart = charts.distribucionDelitos;
        chart.data.labels = Object.keys(distributionData);
        chart.data.datasets[0] = {
            data: Object.values(distributionData),
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)',
                'rgba(199, 199, 199, 0.8)', 'rgba(83, 102, 255, 0.8)', 'rgba(255, 99, 255, 0.8)',
            ],
        };
        chart.update();
    }

    function updateTop5Chart(data) {
        const delitosNacionales = data.filter(d => d.comunidad === 'TOTAL NACIONAL');
        const totalPorTipo = delitosNacionales.reduce((acc, delito) => {
            acc[delito.tipologia] = (acc[delito.tipologia] || 0) + delito.total;
            return acc;
        }, {});

        const top5 = Object.entries(totalPorTipo).sort(([, a], [, b]) => b - a).slice(0, 5).map(([tipo]) => tipo);
        const anios = [...new Set(delitosNacionales.map(d => d.periodo))].sort();

        const datasets = top5.map(tipo => {
            const datosPorAnio = anios.map(anio => {
                const record = delitosNacionales.find(d => d.periodo === anio && d.tipologia === tipo);
                return record ? record.total : 0;
            });
            return {
                label: tipo,
                data: datosPorAnio,
                borderColor: `rgba(${Math.floor(Math.random() * 155)+100}, ${Math.floor(Math.random() * 155)+100}, ${Math.floor(Math.random() * 155)+100}, 1)`,
                fill: false
            };
        });
        
        const chart = charts.evolucionPrincipalesDelitos;
        chart.data.labels = anios;
        chart.data.datasets = datasets;
        chart.update();
    }

    function createChart(canvasId, type, options = {}) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, { type, data: { labels: [], datasets: [] }, options });
    }
});