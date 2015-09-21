# ImageSequence
A javascript based image sequencer to simulate video and (sometimes) used as button rollover effect.

# How to use
ImageSequence constructor parameter consist of:<br>
<ul>
<li>element id</li>
<li>element width</li>
<li>handlers object</li>
<li>sequence type ("none", "background", "button")</li>
<li>frame per second (fps)</li>
</ul>

# First
insert standard html img tag <br>
<code>\<img src="assets/imagesequence.jpg" id="image_sto_seq"></code>
# Second
add javascript code

<code>var imageseq = new ImageSequence("image_sto_seq", 300, {playEnd:onSequenceEnd, rewindEnd:onSequenceRewindEnd}, "none", 24);</code>

the code above will create an image sequence of 300px width at 24 frames/second.

#third
you will need to call one of these codes to start run the image sequence:</br>
<code>imageseq.init(); // to (re)initiate image sequence position</code><br>
<code>imageseq.play(); // to play image sequence from frame 1 to end</code><br>
<code>imageseq.rewind(); // to play image sequence from frame end to frame 1</code><br>
<code>imageseq.setCurrentFrame(); // to go to specific frame of the sequence, param: number</code><br>
<code>imageseq.rewindTo(); // to rewind sequence to specific frame, param: number </code><br>
<code>imageseq.playTo(); // to play sequence to specific frame, param: number </code><br>
<code>imageseq.goTo(); // set current frame to destination frame with animation forward or backward, param: number </code><br>

image positioning<br>
<code>imageseq.positionBottom(); // to change image alignment to bottom </code><br>
<code>imageseq.positionTop(); // to change image alignment to top </code><br>

image sequence that set as a button will be able to access these functions:<br>
<code>imageseq.disableButton(); // to disable rollover & rollout button event </code><br>
<code>imageseq.enableButton(); // to enable rollover & rollout button event </code><br>

adding event handlers:<br>
<code>
imageseq.addHandler();</code>
<code>// add function to trigger when sequence reach certain position,</code> <br>
<code> param: objects of event handlers (init, playEnd, rewindEnd)</code><br>

# Demo
<a href="https://github.com/tcdsew/ImageSequence/blob/master/demo/demo.html">Here</a>
