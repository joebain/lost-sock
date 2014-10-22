var player;

function resetPlayer() {
    player = {
        has_rock: false
    };
}

var tree = [
    {
        title: "The Lost Sock",
        sub_title: "an interactive video adventure by Joe Bain",
        choices: [
            {
                label: "Play",
                next: {
                    id: "start",
                    video: "1-intro",
                    sub_title: "Will you help?",
                    before: resetPlayer,
                    choices: [
                        {
                            label: "No",
                            next: {
                                video: "2-a-dont_help",
                                next: {
                                    title: "You lose",
                                    choices: [
                                        {
                                            label: "Try again?",
                                            next: "start"
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            label: "Yes",
                            next: {
                                id: "look",
                                sub_title: "Where should we look?",
                                video: function() {
                                                if (player.has_rock) {
                                                    return "2-c-help_again";
                                                } else {
                                                    return "2-b-help";
                                                }
                                },
                                choices: [
                                    {
                                        label: "Sock Drawer",
                                        next: {
                                            video: function() {
                                                if (player.has_rock) {
                                                    return "3-f-sock_drawer_no_rock";
                                                } else {
                                                    return "3-a-sock_drawer";
                                                }
                                            },
                                            after: function() {
                                                player.has_rock = true;
                                            },
                                            next: "look"
                                        }
                                    },
                                    {
                                        label: "Washing Line",
                                        next: {
                                            video: function() {
                                                if (player.has_rock) {
                                                    return "3-c-washing_line_w_rock";
                                                } else {
                                                    return "3-b-washing_line_no_rock";
                                                }
                                            },
                                            next: {
                                                title: "You are dead",
                                                choices: [
                                                    {
                                                        label: "Try again?",
                                                        next: "start"
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        label: "Washing Machine",
                                        next: {
                                            video: function() {
                                                if (player.has_rock) {
                                                    return "3-e-washing_machine_w_rock";
                                                } else {
                                                    return "3-d-washing_machine_no_rock";
                                                }
                                            },
                                            choices: [
                                                {
                                                    label: "Read the Clue",
                                                    next: {
                                                        video: "4-clue",
                                                        sub_title: "Have you figured out the riddle?",
                                                        choices: [
                                                            {
                                                                label: "Look at your foot",
                                                                next: "win"
                                                            },
                                                            {
                                                                label: "Check your foot",
                                                                next: "win"
                                                            },
                                                            {
                                                                label: "Is it on your foot?",
                                                                next: "win"
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        id: "win",
        video: "5-end",
        next: {
            title: "You win!",
            choices: [
                {
                    label: "Play again?",
                    next: "start"
                }
            ]
        }
    }
];

var popcorn;

document.addEventListener( "DOMContentLoaded", function() {

    popcorn = Popcorn("#video");
    popcorn.autoplay(false);
    popcorn.controls(false);

    saveNamedNodes(tree);
    executeNode(tree[0]);

}, false );

function showChoices(node) {
    $("#overlay").removeClass("hidden");
    for (var c = 0 ; c < node.choices.length ; c++) {
        (function(choice) {
            var choiceDiv = $("<div class='choice'>");
            choiceDiv.text(choice.label);
            choiceDiv.on("click", function() {
                executeNode(getNode(choice.next));
            });
            $("#choices").append(choiceDiv);
        })(node.choices[c]);
    }
}

function showText(node) {
    if (node.title) {
        $("#title").text(node.title);
    }
    if (node.sub_title) {
        $("#sub-title").text(node.sub_title);
    }
}

var namedNodes = {};
function saveLeaf(leaf) {
    if (leaf.id) {
        namedNodes[leaf.id] = leaf;
    }
}
function saveNamedNodes(tree) {
    for (var t = 0 ; t < tree.length ; t++) {
        var leaf = tree[t];
        saveLeaf(leaf);
        while (leaf.next) {
            leaf = leaf.next;
            saveLeaf(leaf);
        }
        if (leaf.choices) {
            saveNamedNodes(leaf.choices);
        }
    }
}

function getNode(maybeNode) {
    if (typeof maybeNode === "string" && namedNodes[maybeNode]) {
        return namedNodes[maybeNode];
    } else if (typeof maybeNode === "object") {
        return maybeNode;
    }
    throw "This is not a node!";
}

function getVideo(maybeVideo) {
    if (typeof maybeVideo === "string") {
        return maybeVideo;
    } else if (typeof maybeVideo === "function") {
        return maybeVideo();
    }
    throw "This is not a video!";
}

function showPostVideo(node, delay) {
    delay = delay || node.delay || 0;
    if (node.title || node.sub_title) {
        showText(node);
    }
    if (node.choices) {
        showChoices(node);
    } else if (node.next) {
        setTimeout(function() {
            executeNode(getNode(node.next));
        }, delay);
    }
}

var sizes = [
    {w: 320, h: 180},
    {w: 428, h: 240},
    {w: 854, h: 480},
    {w: 1280, h: 720}
];
var types = [
    {type: "video/mp4", extension: "mp4", codecs: "avc1.42C01F, mp4a.40.2"},
    {type: "video/ogg", extension: "ogg", codecs: "theora, vorbis"},
    {type: "video/webm", extension: "webm", codecs: "vp8, vorbis"}
];

function executeNode(node) {
    $("#choices").empty();
    $("#title").empty();
    $("#sub-title").empty();
    $("#video").empty();

    $("#error").removeClass("shown");

    if (node.before) {
        node.before();
    }

    if (node.video) {
        $("#spinner").addClass("shown");
        for (var t = 0 ; t < types.length ; t++) {
            var type = types[t];
            for (var s = 0 ; s < sizes.length ; s++) {
                var w = sizes[s].w;
                var h = sizes[s].h;
                if (s === sizes.length -1 || window.innerWidth * window.devicePixelRatio < sizes[s+1].w) {
                    /*
                    var max_w = undefined;
                    if (s < sizes.length-1) {
                        max_w = sizes[s+1].w;
                    }
                    */
                    var source = $("<source>");
                    var base_url = "";
                    if (window.location.host === "joeba.in") {
                        base_url = "http://s3-eu-west-1.amazonaws.com/joebain/socks/videos/";
                    } else {
                        base_url = "videos_transcoded/";
                    }
                    source[0].src = base_url + getVideo(node.video) + "--" + h + "." + type.extension;
                    /*
                    if (max_w) {
                        var media_string = "all and (max-width: " + max_w + "px)";
                        source.attr("media", media_string);
                    }
                    */
                    source.attr("type", type.type);// + "; codecs=" + type.codecs); // the codec malark seems to screw up firefox and stops it loading anything
                    $("#video").append(source);
                    break;
                }
            }
        }
        var fallbackDiv = $("<div class=fallback>Your browser cannot play this video.</div>");
        $("#video").append(fallbackDiv);
        var playVideoTimeout;
        var playVideo = function() {
            popcorn.off("canplay");
            popcorn.off("canplaythrough");
            popcorn.off("dataloaded");
            clearTimeout(playVideoTimeout);
            console.log("loaded video: " + this.video.currentSrc);
            $("#spinner").removeClass("shown");
            $("#overlay").addClass("hidden");
            popcorn.play();
            popcorn.on("ended", function() {
                popcorn.off("ended");
                if ($("#video")[0].webkitExitFullScreen) {
                    $("#video")[0].webkitExitFullScreen();
                }
                showPostVideo(node);
                if (node.after) {
                    node.after();
                }
            });
        };
        popcorn.on("canplay", playVideo);
        popcorn.on("canplaythrough", playVideo);
        popcorn.on("dataloaded", playVideo);
        playVideoTimeout = setTimeout(playVideo, 2000);
        popcorn.on("error", function(e) {
            popcorn.off("error");
            console.log("error: " + e);
            $("#error").addClass("shown");
            $("#spinner").removeClass("shown");
        });
        popcorn.load();
    } else {
        showPostVideo(node, 5000);
    }
}
