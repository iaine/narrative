var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

playSound = (templates) => {
    const _time = audioCtx.currentTime;
    templates.forEach( temp => self[temp](_time))
}

/**
 * Create a tone. 
 */
 createSound = (toneType, toneFr, start, end, gain=0.0, detune=0, pan=0) => {

    let oscillator = audioCtx.createOscillator();
    oscillator.type = toneType;

    if (detune > 0) { oscillator.detune.setValueAtTime(detune, start); }

    oscillator.frequency.setValueAtTime(toneFr, start); // value in hertz
    
    oscillator.start(start);
    oscillator.stop((parseFloat(start) + parseFloat(end)));

    if (gain > 0.0 && pan == 0) {
        let gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(gain, start);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
    } else if (pan != 0 && gain > 0.0) {
        let gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(gain, start);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        var panNode = audioCtx.createStereoPanner();
        panNode.pan.setValueAtTime(pan, start);
        oscillator.connect(panNode);
        panNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
    } else {
        oscillator.connect(audioCtx.destination);
    }
    
};


/**
 * Function to control the Attack, Delay, Sustain, Release envelope
 * @param T - time
 * @param a - attack
 * @param d - delay
 * @param s - sustain
 * @param r - release
 * @param sustain
 * @returns {GainNode}
 */
 // todo: try the two tones
 // code from https://www.redblobgames.com/x/1618-webaudio/
setADSREnvelope = (audioCtx, T, adsrEnv) => {
    var gainNode = audioCtx.createGain();
    
    function set(v, t) {
        gainNode.gain.linearRampToValueAtTime(v, T + t); 
    }
    set(0.0, -T);
    set(0.0, 0);
    set(1.0, adsrEnv['a']);
    set(adsrEnv['sustain'], adsrEnv['a'] + adsrEnv['d']);
    set(adsrEnv['sustain'], adsrEnv['a'] + adsrEnv['d'] + adsrEnv['s']);
    set(0.0, adsrEnv['a'] + adsrEnv['d'] + adsrEnv['s'] + adsrEnv['r']);
    return gainNode;
};

  /**
  *  Method to fade a tone's volume
  *
  *  @param audioCtx - the audio context
  *  @param pos - position state. Up or down. 
  *  @param now - the current time inherited from audio context
  *  @param volume - the volume to be affected
  *  @returns {GainNode}
  */
fade = (now, volume, pos="down") => {

    var gainNode = audioCtx.createGain();

    if (pos == "up") {
      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.linearRampToValueAtTime((volume*0.25), now + 0.1);
      gainNode.gain.linearRampToValueAtTime((volume*0.5), now + 0.2);
      gainNode.gain.linearRampToValueAtTime((volume*0.75), now + 0.3);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.5);
    } else {
      gainNode.gain.setValueAtTime(volume, now);
      gainNode.gain.linearRampToValueAtTime((volume*0.75), now + 0.1);
      gainNode.gain.linearRampToValueAtTime((volume*0.5), now + 0.2);
      gainNode.gain.linearRampToValueAtTime((volume*0.25), now + 0.3);
      gainNode.gain.linearRampToValueAtTime(0.0, now + 0.5);
    }

    return gainNode;
}

//Sonify the HTML method
getMethod = () => {
    fade(audioCtx.currentTime, 0.1);
    createSound("saw", 120.34, audioCtx.currentTime, 0.4);
    fade(audioCtx.currentTime, 0.15, pos="up");
}

//Sonify the design pattern effect for the listener pattern
listenerPattern = () => {
    const now = audioCtx.currentTime;
    for(let i=0; i<4; i++) {
        createSound('saw', 160.00, now, 0.15);
        createSound('saw', 220.00, now, 0.15);
    };
}

fakeProv = () => {

    const _time = audioCtx.currentTime;

    stopWords();
    docs();

    //cleanData(_time + 0.15);

    alist(_time + 0.75,baseNote=120);

    tokenise(_time + 1);

    matrix(_time + 2);

    topic(_time + 2.25);
}

cleanData = (now) => {

    createSound('saw', 480.00, now, 0.15);
    createSound('saw', 360.00, now + 0.1, 0.15);
    createSound('saw', 240.00, now + 0.2, 0.15);
    createSound('saw', 120.00, now + 0.3, 0.15);

    createSound('saw', 440.00, now, 0.5);
}

stopWords = () => {
    list(audioCtx.currentTime + 0.05);
}

docs = () => {
    list(audioCtx.currentTime, baseNote = 220.00);
}

tokenise = () => {
    const now = audioCtx.currentTime + 1.15;

    createSound('saw', 480.00, now, 0.15);
    createSound('saw', 480.00, now + 0.2, 0.15);
    createSound('saw', 480.00, now + 0.4, 0.15);
    createSound('saw', 480.00, now + 0.8, 0.15); 
}

//make this a calculation in less hacky version
alist = (start, baseNote = 160.00) => {
    const now = audioCtx.currentTime;

    createSound('saw', baseNote, start, 0.15);
    createSound('saw', 220.00, start + 0.1, 0.15);
    createSound('saw', 280.00, start + 0.2, 0.15);
    createSound('saw', 320.00, start + 0.3, 0.15);
}

//make this a calculation in less hacky version
vector = (start, baseNote = 160.00) => {
    const now = audioCtx.currentTime;

    createSound('saw', baseNote, start, 0.15);
    createSound('saw', 220.00, start + 0.1, 0.1);
    createSound('saw', 280.00, start + 0.2, 0.1);
    createSound('saw', 320.00, start + 0.3, 0.1);
}

createMatrix = (now) => {
    createSound('saw', 440.00, now, 0.25);
}

createTopic = (now) => {
    createSound('saw', 440.00, now, 0.25);
}

//make this a calculation in less hacky version
topic = (now, aseNote = 160.00) => {

    createSound('saw', baseNote, now, 0.15);
    createSound('saw', baseNote, now + 0.15, 0.15);
    createSound('saw', baseNote, now + 0.25, 0.15);
    createSound('saw', baseNote, now + 0.4, 0.15);
    createSound('saw', 220.00, now + 0.5, 0.15);
    createSound('saw', 220.00, now + 0.5 + 0.15, 0.15);
    createSound('saw', 220.00, now + 0.5 + 0.25, 0.15);
    createSound('saw', 220.00, now + 0.5 + 0.5, 0.15);
    createSound('saw', 280.00, now + 0.75, 0.15);
    createSound('saw', 280.00, now + 0.75 + 0.15, 0.15);
    createSound('saw', 280.00, now + 0.75 + 0.25, 0.15);
    createSound('saw', 280.00, now + 0.75 + 0.4, 0.15);
    createSound('saw', 320.00, now + 1, 0.15);
    createSound('saw', 320.00, now + 1 + 0.15, 0.15);
    createSound('saw', 320.00, now + 1 + 0.25, 0.15);
    createSound('saw', 320.00, now + 1 + 0.4, 0.15);
}

matrix = (now, baseNote = 160.00) => {

    createSound('saw', baseNote, now, 0.15);
    createSound('saw', 220.00, now+0.1, 0.075);
    createSound('saw', 280.00, now+0.15, 0.075);
    createSound('saw', 320.00, now+0.2, 0.075);

    createSound('saw', 320.00, now, 0.15);
    createSound('saw', 220.00, now, 0.15);
    createSound('saw', 280.00, now, 0.15);
    createSound('saw', 320.00, now, 0.15);
}

tabular = (now, baseNote = 160.00) => {

    createSound('saw', baseNote, now, 0.15);
    createSound('saw', 220.00, now+0.1, 0.075);
    createSound('saw', 280.00, now+0.15, 0.075);
    createSound('saw', 320.00, now+0.2, 0.075);

    createSound('saw', 320.00, now, 0.15);
    createSound('saw', 220.00, now, 0.15);
    createSound('saw', 280.00, now, 0.15);
    createSound('saw', 320.00, now, 0.15);
}
