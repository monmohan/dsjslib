(function () {
    "use strict";

    var ADDRESS_BITS_PER_WORD = 5;//32 bits

    /**
     *
     * @class BitSet
     * @classdesc This class implements an vector of bits that grows as needed.
     * Each component of the bit set has a boolean value. The bits of a BitSet are indexed by non-negative integers.
     * Individual indexed bits can be examined, set, or cleared. By default, all bits in the set initially
     * have the value false.
     * [Reference: BitSet in Java Collections](http://docs.oracle.com/javase/7/docs/api/java/util/BitSet.html)
     * @param size {Number=} Initial size of the BitSet
     * @desc
     * ####Example
     * ```js
     * var BitSet = require("dsjslib").BitSet
     * var bitset=new BitSet(256)
     * ```
     */
    function BitSet(size) {
        var arr = [];
        size = (typeof size !== 'number' || size <= 0)?1:size;
        this._wordsUsed = ((size - 1) >> ADDRESS_BITS_PER_WORD) + 1;
        for (var i = 0; i < this._wordsUsed; i++) {
            arr[i] = 0;
        }

        this._words = arr;

    }

    /**
     * Set the bit at bitIndex to 'true'.
     * If required, BitSet is expanded to accommodate the bitIndex
     * @memberOf BitSet.prototype
     * @instance
     * @param bitIndex {Number} index to set
     */
    BitSet.prototype.set = function (bitIndex) {
        var wordIndex = _getWordIndex.call(this,bitIndex,true);
        var actualIndex = bitIndex & 0X1F;
        this._words[wordIndex] |= 1 << actualIndex;
    };

    /**
     * Examine a bit.
     * @memberOf BitSet.prototype
     * @instance
     * @param bitIndex
     * @returns {Boolean}  Returns true if the bit at bitIndex is set, false otherwise.
     */
    BitSet.prototype.get = function (bitIndex) {
        var wordIndex = _getWordIndex.call(this,bitIndex);
        var actualIndex = bitIndex & 0X1F;
        return(wordIndex < this._wordsUsed) && (
            ((this._words[wordIndex]) & (1 << actualIndex) ) !== 0
            );

    };

    /**
     * @memberOf BitSet.prototype
     * @instance
     * @param bitIndex  {Number=} Set the bit at bitIndex to false.
     * Clears all bits if bitIndex is not provided
     */
    BitSet.prototype.clear = function (bitIndex) {
        var words = this._wordsUsed;
        if (typeof bitIndex === 'undefined') {
            while (words) {
                this._words[--words] = 0;
            }

        } else {
            var wordIndex = _getWordIndex.call(this,bitIndex);
            var actualIndex = bitIndex & 0X1F;

            if (wordIndex < this._wordsUsed) {
                this._words[wordIndex] &= ~(1 << actualIndex);
            }

        }

    };

    /**
     * Sets the bit at the specified index to the complement of its current value.
     * BitSet will be expanded if bitIndex doesn't fit in the current size and
     * the bit will be set to true.
     * @memberOf BitSet.prototype
     * @instance
     * @param bitIndex Index for the operation
     */
    BitSet.prototype.flip = function (bitIndex) {
        var wordIndex = _getWordIndex.call(this,bitIndex,true);
        var actualIndex = bitIndex & 0X1F;
        this._words[wordIndex] ^= (1 << actualIndex);
    };

    /**
     * Return the number of bits set to true in this BitSet
     * Courtesy Hacker's Delight 5.1
     * @memberOf BitSet.prototype
     * @instance
     * @returns {Number} number of bits set to true in this BitSet
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
     * Logical AND with other BitSet.
     * The current BitSet is modified as a result of this operation
     * @memberOf BitSet.prototype
     * @instance
     * @param oBitSet {BitSet} The BitSet to logically AND this BitSet with
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

    /**
     *
     * @param bitIndex
     * @return {*}
     * @private
     */
    function _getWordIndex(bitIndex,resize) {
        if ((typeof bitIndex !== 'number') || bitIndex < 0)
            throw new Error("Invalid Parameter " + bitIndex);
        var wordIndex=(bitIndex >> ADDRESS_BITS_PER_WORD);
        var maxOldIndex=this._wordsUsed-1;
        if(wordIndex>maxOldIndex && resize){
            while(maxOldIndex!==wordIndex){
                this._words.push(0);
                maxOldIndex++;
            }
          this._wordsUsed=wordIndex+1;
        }
        return wordIndex;


    }

    BitSet.prototype._checkInvariants=function(){
        for(var i=0;i<this._wordsUsed;i++){
            if(isNaN(this._words[i])){
                throw new Error('Invariant check failed'+this._words);
            }
        }
    }
    module.exports = BitSet;


})();