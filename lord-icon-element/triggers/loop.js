/**
 * Loop trigger plays the animation from first to last frame infinitely, with no interaction necessary.
 */
export class Loop {
    element;
    targetElement;
    player;
    playTimeout = null;
    constructor(element, targetElement, player) {
        this.element = element;
        this.targetElement = targetElement;
        this.player = player;
    }
    onReady() {
        this.play();
    }
    onComplete() {
        this.play();
    }
    onDisconnected() {
        this.resetPlayDelayTimer();
    }
    play() {
        this.resetPlayDelayTimer();
        if (this.delay > 0) {
            this.playTimeout = setTimeout(() => {
                this.player.playFromBeginning();
            }, this.delay);
        }
        else {
            this.player.playFromBeginning();
        }
    }
    resetPlayDelayTimer() {
        if (!this.playTimeout) {
            return;
        }
        clearTimeout(this.playTimeout);
        this.playTimeout = null;
    }
    get delay() {
        const value = this.element.hasAttribute('delay') ? +(this.element.getAttribute('delay') || 0) : 0;
        return Math.max(value, 0);
    }
}
//# sourceMappingURL=loop.js.map