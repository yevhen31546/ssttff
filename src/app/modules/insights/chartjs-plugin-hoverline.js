import { Chart, ChartDataSets, ChartOptions } from 'chart.js';

Chart.plugins.register({
    posX: null,
    isMouseOut: false,
    drawLine(chart, posX) {
       const ctx = chart.ctx,
          x_axis = chart.scales['x-axis-0'],
          y_axis = chart.scales['y-axis-0'],
          x = posX,
          topY = y_axis.top,
          bottomY = y_axis.bottom;
       if (posX < x_axis.left || posX > x_axis.right) return;
       // draw line
       ctx.save();
       ctx.beginPath();
       ctx.moveTo(x, topY);
       ctx.lineTo(x, bottomY);
       ctx.lineWidth = chart.options.lineOnHover.lineWidth;
       ctx.strokeStyle = chart.options.lineOnHover.lineColor;
       ctx.stroke();
       ctx.restore();
    },
    beforeInit(chart) {
       chart.options.events.push('mouseover');
    },
    afterEvent(chart, event) {
       if (!chart.options.lineOnHover || !chart.options.lineOnHover.enabled) return;
       if (event.type !== 'mousemove' && event.type !== 'mouseover') {
          if (event.type === 'mouseout') this.isMouseOut = true;
          chart.clear();
          chart.draw();
          return;
       }
       this.posX = event.x;
       this.isMouseOut = false;
       chart.clear();
       chart.draw();
       this.drawLine(chart, this.posX);

       var metaData = chart.getDatasetMeta(0).data,
          radius = chart.data.datasets[0].pointHoverRadius,
          posX = metaData.map(e => e._model.x);
       posX.forEach(function(pos, posIndex) {
          if (this.posX < pos + radius && this.posX > pos - radius) {
             chart.updateHoverStyle([metaData[posIndex]], null, true);
             chart.tooltip._active = [metaData[posIndex]];
          } else chart.updateHoverStyle([metaData[posIndex]], null, false);
       }.bind(this));
       chart.tooltip.update();
    },
    afterDatasetsDraw(chart, ease) {
       if (!this.posX) return;
       if (!this.isMouseOut) this.drawLine(chart, this.posX);
    }
 });