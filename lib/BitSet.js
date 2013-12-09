(function () {
    "use strict";

    var ADDRESS_BITS_PER_WORD = 5;//32 bits

    /**
     * BitSet of given size
     * @param size
     * @constructor
     */
    function BitSet(size) {
        var arr = [];
        if (typeof size !== 'number' || size <= 0) throw new Error("Illegal BitSet size specified");
        this._wordsUsed = ((size - 1) >> ADDRESS_BITS_PER_WORD) + 1;
        this.size = size;
        for (var i = 0; i < this._wordsUsed; i++) {
            arr[i] = 0;
        }

        this._words = arr;

    }

    BitSet.prototype.set = function (bitIndex) {
        var wordIndex = _getWordIndex(bitIndex);
        var actualIndex = bitIndex & 0X1F;
        if (wordIndex < this._wordsUsed) {
            this._words[wordIndex] |= 1 << actualIndex;
        } else {
            throw new Error('Out of range ' + bitIndex + ' BitSet size is ' + this.size);
        }
    };

    BitSet.prototype.get = function (bitIndex) {
        var wordIndex = _getWordIndex(bitIndex);
        var actualIndex = bitIndex & 0X1F;
        return(wordIndex < this._wordsUsed) && (
            ((this._words[wordIndex]) & (1 << actualIndex) ) !== 0
            );

    };

    BitSet.prototype.clear = function (bitIndex) {
        var words = this._wordsUsed;
        if (typeof bitIndex === 'undefined') {
            while (words) {
                this._words[--words] = 0;
            }

        } else {
            var wordIndex = _getWordIndex(bitIndex);
            var actualIndex = bitIndex & 0X1F;

            if (wordIndex < this._wordsUsed) {
                this._words[wordIndex] &= ~(1 << actualIndex);
            }

        }

    };

    BitSet.prototype.flip = function (bitIndex) {
        var wordIndex = _getWordIndex(bitIndex);
        var actualIndex = bitIndex & 0X1F;

        if (wordIndex < this._wordsUsed) {
            this._words[wordIndex] ^= (1 << actualIndex);
        } else {
            throw new Error('Out of range ' + bitIndex + ' BitSet size is ' + this.size);
        }

    };

    /**
     * Return the number of bits set to true in this
     * BitSet
     * Courtesy Hacker's Delight 5.1
     */
    BitSet.prototype.cardinality = function () {
        return this._words.reduce(function (sum, w) {
            w = w - ((w >>> 1) & 0x55555555);
            w = (w & 0x33333333) + ((w >>> 2) & 0x33333333);
            w = (w + (w >>> 4)) & 0x0f0f0f0f;
            w = w + (w >>> 8);
            w = w + (w >>> 16);
            return sum + (w & 0x3F);

        }, 0);

    };


    /**
     * Logical AND with other BitSet
     */
    BitSet.prototype.and = function (oBitSet) {
        var words = this._wordsUsed;
        while (words > oBitSet._wordsUsed) {
            this._words[--words] = 0;

        }
        while (words) {
            words--;
            this._words[words] &= oBitSet._words[words];
        }

    }


    function _getWordIndex(bitIndex) {
        if ((typeof bitIndex !== 'number') || bitIndex < 0)
            throw new Error("Invalid Parameter " + bitIndex);
        return bitIndex >> ADDRESS_BITS_PER_WORD;

    }


    module.exports = BitSet;


})();