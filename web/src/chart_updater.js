
import {fetchAllocations, fetchGarbageCollection, fetchHeap, fetchStartupTime, fetchThroughput} from './dataloader'

function addPrefixAndSuffix(series){
    return series.map(ser => {
        ser.prefix = ser.name.replace(/-with-agent/, '').replace(/-no-agent/, '');
        ser.suffix = ser.name.replace(/^.*-(with-agent|no-agent)$/, '$1');
        return ser;
    });
}

function remapLargeUnits(data){
    data.unit = 'MB';
    let divisor = 1024*1024;
    if(data.series[0].data[0] > 1024*1024*1024){
        data.unit = 'GB';
        divisor = 1024*1024*1024;
    }
    data.series = data.series.map(series => {
        series.data = series.data.map( v => v / divisor)
        return series;
    })
    return data;

}

export default class ChartUpdater {

    constructor(updateChartProps) {
        this.updateChartProps = updateChartProps;
    }

    showAllocations() {
        console.log('Showing allocations');
        const updater = this.updateChartProps;
        fetchAllocations()
            .then(remapLargeUnits)
            .then(data => {
                updater({
                    title: `Allocations (${data.unit})`,
                    labels: data.labels,
                    series: addPrefixAndSuffix(data.series)
                });
            });
    }

    showGarbageCollection() {
        console.log('Showing garbage collection info');
        const updater = this.updateChartProps;
        fetchGarbageCollection()
            .then(data => {
                updater({
                    title: `Garbage Collections (sum time in seconds)`,
                    labels: data.labels,
                    series: addPrefixAndSuffix(data.series)
                });
            })
    }

    showHeapUsage() {
        console.log('Showing heap usage');
        const updater = this.updateChartProps;
        fetchHeap()
            .then(remapLargeUnits)
            .then(data => {
                updater({
                    title: `Heap usage (${data.unit})`,
                    labels: data.labels,
                    series: addPrefixAndSuffix(data.series)
                });
            })
    }

    showThroughput() {
        console.log('Showing throughput');
        const updater = this.updateChartProps;
        fetchThroughput()
            .then(data => {
                updater({
                    title: `Throughput (time/request)`,
                    labels: data.labels,
                    series: addPrefixAndSuffix(data.series)
                });
            })
    }

    showStartupTime(){
        console.log('Showing startup times');
        const updater = this.updateChartProps;
        fetchStartupTime()
            .then(data => {
                updater({
                    title: "Startup time",
                    labels: data.labels,
                    series: addPrefixAndSuffix(data.series)
                });
            });
    }
}