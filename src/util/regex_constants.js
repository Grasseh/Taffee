module.exports = {
    TEST_DETECTION_REGEX: /\[.*?\]\(\?=.*?\)\)/gm,
    TEST_ELEMENTS_REGEX: /(?:\[[&]?(.*?)\])\(\?=(?:(.*?)\.)?(.*?)\((.*)\)\)/gm,
    TEST_PARAMETER_NAME_REGEX: /[\w\d]+/gm,

    PARAMETER_DETECTION_REGEX: /\[.*?\]\(#.*?\)/gm,
    PARAMETER_ELEMENTS_REGEX: /(?:.*?)\[(.*)?\]\(#(.*)?\)/gm
};
