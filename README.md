# Job Logger

An *ASP.net core* based application for logging job search information per
[Washington state unemployment guidelines](https://esd.wa.gov/unemployment/job-search-requirements).

Interesting Features:

* Per-user (virtual) log collections using AspNetCore.Identity & EntityFrameworkCore.
* UI using [Bootstrap](http://getbootstrap.com/getting-started/) driven by
    [Knockout](http://knockoutjs.com/index.html) using html templates with
    models written in [Typescript](https://www.typescriptlang.org/index.html).
* Main page run as a <abbr title="Single Page Application">SPA</abbr> pulling
    data from the server using ajax.
* A working [xUnit](https://xunit.github.io/) test setup using
    [Moq](https://github.com/Moq/moq4/wiki/Quickstart).
* Additional project development info on [My blog](http://kitsu.github.io/tags/aspnetcore/).

## Getting Started

This project was created using Visual Studio Community 2015 on Windows 10.
Additional configuration may be required on other platforms/IDEs.

## Deployment

This App is currently deployed on Azure as a WebApp at https://joblogger.azurewebsites.net/
. Deployment happens automatically when changes are pushed to
[this Github repo](https://github.com/kitsu/JobLogger).

## License

This project is licensed under the 3 Clause BSD License - see the
[LICENSE.txt](LICENSE.txt) file for details

