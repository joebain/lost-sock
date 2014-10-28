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

vce.init(tree, {el: "#container", video_url: "http://s3-eu-west-1.amazonaws.com/joebain/socks/videos/"});

