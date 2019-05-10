function countdown(options) {

    function tick() {
        let eventDate = settings.date / 1000;
        let today = Math.floor(Date.now() / 1000);

        if (eventDate <= today) {
            settings.callback.call(this);
            clearInterval(interval);
        }

        // Do math
        let seconds = eventDate - today;

        let days = Math.floor(seconds / (86400));
        seconds -= days * 86400;

        let hours = Math.floor(seconds / (3600));
        seconds -= hours * 3600;

        let minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;

        // Set text of labels, if used.
        (element.querySelector(".days-text") || "").innerText = days === 1 ? "day" : "days";
        (element.querySelector(".hours-text") || "").innerText = hours === 1 ? "hour" : "hours";
        (element.querySelector(".minutes-text") || "").innerText = minutes === 1 ? "minute" : "minutes";
        (element.querySelector(".seconds-text") || "").innerText = seconds === 1 ? "second" : "seconds";

        // Zero-pad
        if (settings['format'] === true) {
            days = days < 10 ? "0" + days : days;
            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
        }

        if (!isNaN(eventDate)) {
            element.querySelector(".days").innerText = days;
            element.querySelector(".hours").innerText = hours;
            element.querySelector(".minutes").innerText = minutes;
            element.querySelector(".seconds").innerText = seconds;
        } else {
            console.error("Invalid date. Here's an example: 12 Tuesday 2016 17:30:00");
            clearInterval(interval);
        }
    }

    const element = document.querySelector(options.element);

    const settings = {
        date: new Date(options.date || element.dataset.date),
        format: options.format || true,
        callback: options.callback || '',
    }

    // Run once
    tick();

    // Run every second
    var interval = setInterval(tick, 1000);
}

countdown({
    element: "#countdown"
});
