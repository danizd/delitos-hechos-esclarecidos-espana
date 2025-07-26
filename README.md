# Dashboard de Delitos en España

Este repositorio contiene un dashboard interactivo que visualiza los datos de delitos esclarecidos en España, obtenidos del Portal Estadístico de Criminalidad del Ministerio del Interior.

## Descripción

El dashboard muestra una serie de gráficos que permiten analizar la evolución de la criminalidad en España, tanto a nivel nacional como por comunidad autónoma. Los datos abarcan el periodo de 2010 a 2023 y se pueden filtrar por:

- Comunidad Autónoma
- Tipología de delito
- Año

## Visualizaciones

El dashboard incluye los siguientes gráficos:

- **Evolución de Delitos:** Un gráfico de líneas que muestra la evolución de un tipo de delito específico en una comunidad autónoma a lo largo de los años.
- **Total de delitos por comunidad autónoma:** Un gráfico de barras que compara el número total de delitos entre las diferentes comunidades autónomas.
- **Distribución de tipos de delito:** Un gráfico de tarta que muestra la proporción de cada tipo de delito para un año y comunidad autónoma seleccionados.
- **Top 5 Delitos (Evolución Nacional):** Un gráfico de líneas que muestra la evolución de los cinco delitos más comunes a nivel nacional.

## Cómo ejecutar el proyecto

Para ver el dashboard, necesitas ejecutar un servidor web local. Sigue estos pasos:

1. Clona o descarga este repositorio en tu máquina local.
2. Abre una terminal o línea de comandos en la carpeta del proyecto.
3. Ejecuta el siguiente comando para iniciar un servidor web simple con Python:
   ```bash
   python -m http.server 8000
   ```
4. Abre tu navegador web y ve a la siguiente dirección: `http://localhost:8000`

## Fuente de los Datos

- **Institución:** Ministerio del Interior de España
- **Portal:** Portal Estadístico de Criminalidad
- **Dataset:** Series anuales. Hechos esclarecidos por comunidades autónomas, tipología penal y periodo.
- **Enlace:** [https://estadisticasdecriminalidad.ses.mir.es/publico/portalestadistico/](https://estadisticasdecriminalidad.ses.mir.es/publico/portalestadistico/)
