(() => {
    try {require('electron-connect').client.create();}catch(e){}

    const fs = require("fs");
    const dataURIToBuffer = require("data-uri-to-buffer");
    const {remote} = require('electron');
    const {Menu, MenuItem, dialog} = remote;

    const menu = Menu.buildFromTemplate([
        {
            label: remote.app.getName(),
            submenu: [
                {
                    label: `About ${remote.app.getName()}`,
                    role: "about",
                },
            ]
        },
        {
            label: "File",
            submenu: [
                {
                    label: "Save screen",
                    async click() {
                        const path = dialog.showSaveDialog({filters: [{name: "png", extensions: ["png"]}]});

                        const video = $("#video").targets[0];

                        const canvas = document.createElement("canvas");
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;

                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(video, 0, 0);

                        const buffer = dataURIToBuffer(canvas.toDataURL("image/png"));
                        fs.writeFile(path, buffer, err => {
                            if (err) {
                                alert(err);
                            }
                            else {
                                // beep()
                            }
                        });
                    }
                },
                {
                    label: "Open via Twitter",
                    click() {
                        console.log("Open via twitter");
                    }
                },
                {
                    label: "Open via Twitter",
                    click() {
                        console.log("Open via YouTube");
                    }
                }
            ]
        },
        {
            label: "Share",
            submenu: [
                {
                    label: "Pinterest",
                    click() {
                        console.log("Share to Pinterest");
                    }
                },
            ]
        },
        {
            label: "Window",
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click(item, focusedWindow) {
                        if (focusedWindow) focusedWindow.webContents.toggleDevTools();
                    }
                },
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);

    const $ = (selector, el = document) => {
        const targets = [].slice.call(el.querySelectorAll(selector), 0);

        return {
            targets,

            on(event, listener) {
                targets.forEach(el => el.addEventListener(event, listener));
                return this;
            },

            addClass(classes) {
                targets.forEach(el => el.classList.add(classes));
            }
        };
    }

    window.addEventListener("DOMContentLoaded", () => {
        const $video = $("#video");
        const video = $video.targets[0];
        console.log($video);

        const cancelEvent = ev => {
            ev.stopPropagation();
            ev.preventDefault();
        }

        $video
            .on("dragenter", cancelEvent)
            .on("dragover", cancelEvent)
            .on("drop", async ev => {
                if (! ev.dataTransfer) return;
                $("#overlay").addClass("disabled");
                video.src = URL.createObjectURL(ev.dataTransfer.files[0]);
                cancelEvent(ev);
            });

        $("body").on("keydown", ev => {
            // 30FPSと仮定
            const oneFrameTime = 1 / 60;

            switch (ev.code) {
                case "ArrowRight":
                    video.currentTime += oneFrameTime;
                    break;

                case "ArrowLeft":
                    video.currentTime -= oneFrameTime;
                    break;

                case "Space":
                    video.paused ? video.play() : video.pause();
                    break;
            }
            cancelEvent(ev);
        });
    });
})();
