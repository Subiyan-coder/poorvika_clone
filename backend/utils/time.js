const parseDuration = (duration) => {

    const value = parseInt(duration);
    const unit = duration.slice(-1);

    const multipliers = {
        s : 1000,
        m : 60 * 1000,
        h : 60 * 60 * 1000,
        d : 24 * 60 * 60 * 1000
    };

    if(!multipliers[unit] || isNaN(value)){
        throw new Error("Invalid duration format");
    }

    return value * multipliers[unit];
};

module.exports = {parseDuration}