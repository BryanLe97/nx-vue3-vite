<template>
  <div>
    <div v-if="inputData" id="container"></div>
  </div>
</template>

<script>
import { P } from "@antv/g2plot";

const customTooltip = "<div>{tooltipContent}</div>";

const tooltipField = [
  "itemCode",
  "startTime",
  "endTime",
  "time",
  "totalTime",
  "unit",
  "totalUnit",
  "downtime",
  "type",
];

const STATUS_COLOR = {
  1: "#0d7452",
  2: "#fa8c16",
  3: "#15b982",
  4: "#cdd3db",
  5: "#d46b08",
};

export default {
  name: "CtpGanttChart",
  props: {
    inputData: {
      type: Array,
      default: null,
    },
  },

  data() {
    return {
      chart: undefined,
      tooltipListField: "",
      defaultOption: {
        marginRatio: 0,
      },
    };
  },

  computed: {
    data() {
      this.inputData.forEach((obj) => {
        obj.range = [obj.startTime, obj.endTime];
      });
      return this.inputData;
    },

    now() {
      return this.$moment().utc().format();
    },
  },

  watch: {
    data(newVal) {
      this.chart.destroy();

      this.chart = new P(
        "container",
        {
          data: newVal,
          xField: "line",
          yField: "range",
          autoFit: true,
        },
        this.adaptor,
        this.defaultOption
      );
      this.chart.render();
    },
  },

  async mounted() {
    this.tooltipListField = await this.formatTooltipString(tooltipField);
    if (this.inputData) {
      this.chart = new P(
        "container",
        {
          data: this.data,
          xField: "line",
          yField: "range",
          // autoFit: true,
        },
        this.adaptor,
        this.defaultOption
      );
      this.chart.render();
    }
  },

  methods: {
    formatTooltipString(listField) {
      return listField.toString().replaceAll(",", "*");
    },

    adaptor(params) {
      const { chart, options } = params;
      const { data, xField, yField, marginRatio } = options;

      chart.data(data);

      chart.coordinate().transpose().scale(1, 1);

      chart.scale("range", {
        type: "time",
        nice: true,
        mask: "DD/MM/YYYY HH:mm",
        max: `${this.$moment().format("YYYY-MM-DD")} 23:59:00`,
      });

      chart.tooltip({
        showMarkers: false,
        showTitle: false,
        itemTpl: customTooltip,
      });

      chart.interaction("element-active");

      chart
        .interval()
        .adjust({
          type: "dodge",
          dodgeBy: "type",
          marginRatio,
        })
        .position(`${xField}*${yField}`)
        .color("status", (status) => {
          return STATUS_COLOR[status];
        })
        // .size("type", (type) => {
        //   if (type === "plan") {
        //     return 5;
        //   }
        //   return 20;
        // })
        .tooltip(
          this.tooltipListField,
          (
            itemCode,
            startTime,
            endTime,
            time,
            totalTime,
            unit,
            totalUnit,
            downtime,
            type
          ) => {
            if (type === "plan")
              return {
                tooltipContent: `<p>Plan: ${this.$moment(startTime).format(
                  "DD/MM/YYYY HH:mm"
                )} - ${this.$moment(endTime).format("DD/MM/YYYY HH:mm")}</p>`,
              };
            else
              return {
                tooltipContent: `
                <p class="font-weight-bold">${itemCode}</p>
                <p>Time: ${time}/${totalTime} mins</p>
                <p>Unit: ${unit}/${totalUnit}</p>
                <p>Downtime: ${downtime} mins</p>
              `,
              };
          }
        );

      chart.legend(false);

      chart.annotation().line({
        start: ["min", this.now],
        end: ["max", this.now],
        style: {
          stroke: "#ff4d4f",
          lineWidth: 1.5,
          strokeOpacity: 1,
        },
        offsetY: -30,
        top: true,
      });

      chart.annotation().line({
        start: ["min", this.now],
        end: ["max", this.now],
        style: {
          stroke: "#ff4d4f",
          lineWidth: 1.5,
        },
        offsetY: 30,
        top: true,
      });

      chart.axis("line", { tickLine: null });
    },
  },
};
</script>

<style></style>
