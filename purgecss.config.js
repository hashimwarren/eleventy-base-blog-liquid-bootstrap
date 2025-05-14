module.exports = {
  content: [
    "./_includes/**/*.liquid",
    "./content/**/*.liquid",
    "./_site/**/*.html"
  ],
  css: ["./css/bootstrap.css"],
  safelist: {
    standard: [/^btn/, /^alert/, /^card/, /^navbar/, /^breadcrumb/, /^badge/]
  }
};
