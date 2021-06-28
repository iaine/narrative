from flask import Flask
from flask import render_template

import random
import rdflib
from midiutil import MIDIFile

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/explain")
def explain_index():
    g = rdflib.Graph()
    g.parse("form_outfile.ttl", format="turtle")

    #if exists, get a generated Time
    qres = g.query(
        """SELECT ?a ?form
          WHERE {
             ?a FORM:type ?form .
             ?a PROV:generatedAtTime ?gentime .
          } ORDER BY ASC (?gentime)
        """)
    templates = []

    for row in qres:
        templates.append(write_template(row))

    forms = []
    for row in qres:
        print(str(row[1]))
        forms.append(str(row[1]))

    return render_template('data.html', templates=templates, forms=forms)


@app.route('/midi')
def midi_index():
    #midi options here
    track    = 0
    channel  = 0
    time     = 0    # In beats
    duration = 1    # In beats
    tempo    = 60   # In BPM
    volume   = 62  # 0-127, as per the MIDI standard
    pitch = 30

    # One track, defaults to format 1 (tempo track is created automatically)
    # set tracks to max number of streams connected
    num_tracks = int(2)
    MyMIDI = MIDIFile(num_tracks)  
    MyMIDI.addTempo(track, time, tempo)

    g = rdflib.Graph()
    g.parse("form_outfile.ttl", format="turtle")

    #if exists, get a generated Time
    qres = g.query(
        """SELECT ?a ?form
          WHERE {
             ?a FORM:type ?form .
             ?a PROV:generatedAtTime ?gentime .
          } ORDER BY ASC (?gentime)
        """)

    beats = 0
    for row in qres:
        beats += 3
        print(str(row[1].strip()))
        locals()[str(row[1]).strip()](beats)
    
    with open("form.mid", "wb") as output_file:
        MyMIDI.writeFile(output_file)


def alist(_time):
    '''
       List style is to increase the pitch for each step
       but keep the rest the same
    '''
    in_time = _time
    for i in range(0,5):
        in_time += 0.2
        pitch = 40 + i
        MyMIDI.addNote(track, channel, pitch, in_time, 1, volume)

def vector(_time):
    '''
       Vector style is to increase the pitch for each step
       but keep the rest the same. Like a list but smaller steps.
       It is faster than a list. 
    '''
    in_time = _time
    for i in range(0,5):
        in_time += 0.1
        pitch = 40 + i
        MyMIDI.addNote(track, channel, pitch, in_time, 0.5, volume)
def tabular(_time):
    '''
       Tabular style is to increase the pitch for each step
       but nudge the note across
    '''
    in_time = _time
    _pitch = pitch
    for i in range(0,5):
        in_time += 0.2
        for j in range(30,50,5):
            _pitch += 5
            MyMIDI.addNote(track, channel, _pitch, in_time, 0.1, volume)
        #MyMIDI.addNote(track, channel, 35, in_time, 0.1, volume)
        #MyMIDI.addNote(track, channel, 40, in_time, 0.1, volume)
        #MyMIDI.addNote(track, channel, 45, in_time, 0.1, volume)
        #MyMIDI.addNote(track, channel, 50, in_time, 0.1, volume)
        _pitch = pitch

def matrix(_time):
    '''
       List style is to increase the pitch for each step
       but keep the rest the same
    '''
    vol = random.randint(40, 80)
    dur = 0.5
    in_time = _time
    _pitch = pitch
    for i in range(0,5):
        in_time += 0.2
        for j in range(30,50,5):
            _pitch += 5
            MyMIDI.addNote(track, channel, _pitch, in_time, 0.1, volume)
        #MyMIDI.addNote(track, channel, 35, in_time, 0.1, volume)
        #MyMIDI.addNote(track, channel, 40, in_time, 0.1, volume)
        #MyMIDI.addNote(track, channel, 45, in_time, 0.1, volume)
        #MyMIDI.addNote(track, channel, 50, in_time, 0.1, volume)
        _pitch = pitch
        
def model(_time):
    '''
       List style is to increase the pitch for each step
       but keep the rest the same
    '''
    vol = random.randint(40, 80)
    dur = 0.3
    in_time = _time
    for i in range(0,5):
        pitch = random.randint(40, 80)
        in_time += 0.1
        for j in range(0,5):
            #in_time += 0.1
            MyMIDI.addNote(track, channel, pitch, _time, dur, vol)

def write_template(objtostr):
    return "%s is in the form of a %s" % objtostr
