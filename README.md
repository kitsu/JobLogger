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

To run this you will *may* need to re-create the `wwwroot/lib` and
`wwwroot/scripts` directories. Bower should then be able to populate the lib
directory. The scripts directory will populate when the Typescript code is
built (which is configured in gulpfile.js to happen on project build).

This project was created using Visual Studio Community 2015 on Windows 10.
Additional configuration may be required on other platforms/IDEs.

## Deployment

I intend to deploy this on Azure, but it is still early days.

## ToDo

- [x] Fix edit toggle button not showing state (custom pseudo button?).
- [ ] Add LogRepo unittests (requires mocking many things).
- [ ] Add filter by date range (maybe just "Week of The XX"?).
- [ ] Add basic log search ability - text match against string fields.
- [ ] Add advanced log search ability - search by type, flags, specific field match.
- [ ] Add auth token code to all CRUD methods on client & server.
- [ ] Setup Google Sign-In, investigate LinkedIn Sign-In.
- [ ] Create per-user sharable link with uneditable list view.
- [ ] Add report creation (plain text? html?).
- [ ] Research Azure deployment, setup account, make test deployment.
- [ ] Add Google Analytics, setup Ad-Unit, add Url to Search Console.
- [ ] ...
- [ ] Profit?

## License

This project is licensed under the 3 Clause BSD License - see the
[LICENSE.txt](LICENSE.txt) file for details

