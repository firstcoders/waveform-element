/* eslint-disable camelcase */
export default class Peaks {
  constructor({ data, sample_rate, samples_per_pixel, length, duration }) {
    this.data = data;

    // if we get a structure consistent withBBC audiowaveform, deduce duration
    // otherwise use duration if provided
    if ((samples_per_pixel && samples_per_pixel, length)) {
      this.duration = (samples_per_pixel * length) / sample_rate;
    } else if (duration) {
      this.duration = duration;
    } else {
      throw new Error('Cannot deduce duration');
    }
  }

  get peaksPerSecond() {
    return this.data.length / this.duration;
  }

  /**
   * Modifies the duration, but either adding null data to the peaks, or truncating data.
   *
   * @param {Number} duration
   * @returns {Peaks} modified peaks
   */
  setDuration(duration) {
    if (this.duration < duration) {
      const nPeaksRequired = this.peaksPerSecond * duration;
      const nPeaksToAdd = nPeaksRequired - this.data.length;

      return new Peaks({
        duration,
        data: [
          ...this.data,
          ...(nPeaksToAdd > 0
            ? new Array(Math.floor(nPeaksToAdd)).fill(0)
            : []),
        ],
      });
    }

    if (this.duration > duration) {
      const peaksRequired = this.peaksPerSecond * duration;

      return new Peaks({
        duration,
        data: this.data.slice(0, peaksRequired),
      });
    }

    return this;
  }
}
