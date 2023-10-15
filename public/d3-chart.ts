import { select, scaleOrdinal, interpolate, pie, arc } from "d3";

const svg = select("body").append("svg").append("g");

svg.append("g").attr("class", "slices");
svg.append("g").attr("class", "labels");
svg.append("g").attr("class", "lines");

const width = 960;
const height = 450;
const radius = Math.min(width, height) / 2;

const pieGenerator = pie()
    .sort(null)
    .value((d) => d.value);

const arcGenerator = arc()
    .innerRadius(radius * 0.4)
    .outerRadius(radius * 0.8);

const outerArc = arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

svg.attr("transform", `translate(${width / 2}, ${height / 2})`);

const color = scaleOrdinal()
    .domain([
        "Lorem ipsum",
        "dolor sit",
        "amet",
        "consectetur",
        "adipisicing",
        "elit",
        "sed",
        "do",
        "eiusmod",
        "tempor",
        "incididunt",
    ])
    .range([
        "#98abc5",
        "#8a89a6",
        "#7b6888",
        "#6b486b",
        "#a05d56",
        "#d0743c",
        "#ff8c00",
    ]);

function randomData() {
    const labels = color.domain();
    return labels.map((label) => ({
        label: label,
        value: Math.random(),
    }));
}

change(randomData());

select(".randomize").on("click", () => {
    change(randomData());
});

function change(data) {
    /* ------- PIE SLICES -------*/
    const slice = svg
        .select(".slices")
        .selectAll("path.slice")
        .data(pieGenerator(data), (d) => d.data.label);

    slice
        .enter()
        .append("path")
        .style("fill", (d) => color(d.data.label))
        .attr("class", "slice");

    slice
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
            this._current = this._current || d;
            const interpolateFn = interpolate(this._current, d);
            this._current = interpolateFn(0);
            return (t) => arcGenerator(interpolateFn(t));
        });

    slice.exit().remove();

    /* ------- TEXT LABELS -------*/

    const text = svg
        .select(".labels")
        .selectAll("text")
        .data(pieGenerator(data), (d) => d.data.label);

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text((d) => d.data.label);

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text.transition()
        .duration(1000)
        .attrTween("transform", function (d) {
            this._current = this._current || d;
            const interpolateFn = interpolate(this._current, d);
            this._current = interpolateFn(0);
            return function (t) {
                const d2 = interpolateFn(t);
                const pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            };
        })
        .styleTween("text-anchor", function (d) {
            this._current = this._current || d;
            const interpolateFn = interpolate(this._current, d);
            this._current = interpolateFn(0);
            return (t) => {
                const d2 = interpolateFn(t);
                return midAngle(d2) < Math.PI ? "start" : "end";
            };
        });

    text.exit().remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    const polyline = svg
        .select(".lines")
        .selectAll("polyline")
        .data(pieGenerator(data), (d) => d.data.label);

    polyline.enter().append("polyline");

    polyline
        .transition()
        .duration(1000)
        .attrTween("points", function (d) {
            this._current = this._current || d;
            const interpolateFn = interpolate(this._current, d);
            this._current = interpolateFn(0);
            return (t) => {
                const d2 = interpolateFn(t);
                const pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arcGenerator.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit().remove();
}
