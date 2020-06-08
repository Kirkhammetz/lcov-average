const fs = require("fs");

module.exports = function parse(filename) {
  const file = fs.readFileSync(filename, "utf-8");
  return module.exports.format(file);
};

module.exports.format = function (file) {
  const dataset = ["end_of_record"].concat(file.split("\n"));

  const data = dataset.map(function (current) {
    const item = {
      lines: {
        found: 0,
        hit: 0,
        details: [],
      },
      functions: {
        hit: 0,
        found: 0,
        details: [],
      },
      branches: {
        hit: 0,
        found: 0,
        details: [],
      },
    };
    const line = current.trim();
    const allparts = line.split(":");
    const parts = [allparts.shift(), allparts.join(":")];

    let lines;
    let fn;

    switch (parts[0].toUpperCase()) {
      case "TN":
        item.title = parts[1].trim();
        break;
      case "SF":
        item.file = parts.slice(1).join(":").trim();
        break;
      case "FNF":
        item.functions.found = Number(parts[1].trim());
        break;
      case "FNH":
        item.functions.hit = Number(parts[1].trim());
        break;
      case "LF":
        item.lines.found = Number(parts[1].trim());
        break;
      case "LH":
        item.lines.hit = Number(parts[1].trim());
        break;
      case "DA":
        lines = parts[1].split(",");
        item.lines.details.push({
          line: Number(lines[0]),
          hit: Number(lines[1]),
        });
        break;
      case "FN":
        fn = parts[1].split(",");
        item.functions.details.push({
          name: fn[1],
          line: Number(fn[0]),
        });
        break;
      case "FNDA":
        fn = parts[1].split(",");
        item.functions.details.some(function (i, k) {
          if (i.name === fn[1] && i.hit === undefined) {
            item.functions.details[k].hit = Number(fn[0]);
            return true;
          }
        });
        break;
      case "BRDA":
        fn = parts[1].split(",");
        item.branches.details.push({
          line: Number(fn[0]),
          block: Number(fn[1]),
          branch: Number(fn[2]),
          taken: fn[3] === "-" ? 0 : Number(fn[3]),
        });
        break;
      case "BRF":
        item.branches.found = Number(parts[1]);
        break;
      case "BRH":
        item.branches.hit = Number(parts[1]);
        break;
    }

    return item;
  });

  data.shift();

  if (!data.length) {
    throw new Error("FAILED_TO_PARSE_STRING");
  }
  return data;
};

module.exports.for_mat = function (file) {
  const dataset = ["end_of_record"].concat(file.split("\n"));
  let data = [];
  for (let index = 0; index < dataset.length; index++) {
    const item = {
      lines: {
        found: 0,
        hit: 0,
        details: [],
      },
      functions: {
        hit: 0,
        found: 0,
        details: [],
      },
      branches: {
        hit: 0,
        found: 0,
        details: [],
      },
    };
    const line = dataset[index].trim();
    const allparts = line.split(":");
    const parts = [allparts.shift(), allparts.join(":")];

    let lines;
    let fn;

    switch (parts[0].toUpperCase()) {
      case "TN":
        item.title = parts[1].trim();
        break;
      case "SF":
        item.file = parts.slice(1).join(":").trim();
        break;
      case "FNF":
        item.functions.found = Number(parts[1].trim());
        break;
      case "FNH":
        item.functions.hit = Number(parts[1].trim());
        break;
      case "LF":
        item.lines.found = Number(parts[1].trim());
        break;
      case "LH":
        item.lines.hit = Number(parts[1].trim());
        break;
      case "DA":
        lines = parts[1].split(",");
        item.lines.details.push({
          line: Number(lines[0]),
          hit: Number(lines[1]),
        });
        break;
      case "FN":
        fn = parts[1].split(",");
        item.functions.details.push({
          name: fn[1],
          line: Number(fn[0]),
        });
        break;
      case "FNDA":
        fn = parts[1].split(",");
        item.functions.details.some(function (i, k) {
          if (i.name === fn[1] && i.hit === undefined) {
            item.functions.details[k].hit = Number(fn[0]);
            return true;
          }
        });
        break;
      case "BRDA":
        fn = parts[1].split(",");
        item.branches.details.push({
          line: Number(fn[0]),
          block: Number(fn[1]),
          branch: Number(fn[2]),
          taken: fn[3] === "-" ? 0 : Number(fn[3]),
        });
        break;
      case "BRF":
        item.branches.found = Number(parts[1]);
        break;
      case "BRH":
        item.branches.hit = Number(parts[1]);
        break;
    }

    return item;
  }

  data.shift();

  if (!data.length) {
    throw new Error("FAILED_TO_PARSE_STRING");
  }
  return data;
};
