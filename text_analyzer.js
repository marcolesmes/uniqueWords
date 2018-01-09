/**
 * Created by lesmesma on 05/01/2018.
 */

/**
 * Funcion para unificar las palabras. Por ejemplo: words = word
 * @param word
 * @returns string
 */
function unpluralize(word) {
    if (word.match(/is\b/g)) {
        return word;
    } else if (word.match(/ies\b/g)) {
        return word.replace(/.{3}\b/, 'y');
    } else if (word.match(/ses\b|hes\b|xes\b|zes\b/g)) {
        return word.replace(/.{2}\b/, '');
    } else if (word.match(/s\b/g)) {
        return word.replace(/.{1}\b/, '');
    } else {
        return word;
    }
}

/**
 * Funcion que filtra las palabras que no deben estar en el analisis
 * @param word
 * @returns {*}
 */
function filterWords(word) {
    var forExclude = ["a", "the", "and", "of", "in", "be", "also", "as"];
    var exclude = false;

    for (var i = 0; i < forExclude.length; i++) {
        if (word === forExclude[i] || word === '') {
            exclude = true;
        }
    }

    return exclude ? null : unpluralize(word);
}

/**
 * Funcion que mapea el resultado
 * @param cleanedText
 */
function mapper (cleanedText) {
    var phrases = cleanedText[1];
    var words = cleanedText[0];
    var results = {};
    for (var i = 0; i < words.length; i++) {
        var counter = 0;
        var index = [];
        for (var j = 0; j < phrases.length; j++) {
            if (phrases[j].indexOf(words[i]) !== -1) {
                counter++;
                index.push(j);
            }
        }
        if (counter) {
            var word = {};
            word.word = words[i];
            word.totaloccurrences = counter;
            word.sentenceindexes = index;
            results[i] = word;
            words.splice(0, counter);
        }
    }
    return results;
}

/**
 * Funcion que procesa el texto
 * @param phrase
 * @returns {[*,*]}
 */
function processPhrase(phrase) {
    var filteredWords = [];
    var filteredSentence = [];
    for (var i = 0; i < phrase.length; i++) {
        var sentenceWords = [];
        var words = phrase[i].replace(/[^a-zA-Z ]|^\s+|\s+$/g, '').toLowerCase().split(' ');
        for (var j = 0; j < words.length; j++) {
            var cleanWord = filterWords(words[j]);
            if (cleanWord !== null) {
                filteredWords.push(cleanWord);
                sentenceWords.push(cleanWord);
            }
        }
        filteredSentence[i] = sentenceWords.join(' ');
    }
    return [filteredWords.sort(), filteredSentence];
}

/**
 * Funcion principal de ejecucion
 * @param text
 */
function analyzer (text) {
    var sentences = text.split('.');
    var cleanedText = processPhrase(sentences);
    var result = mapper(cleanedText);
    console.log(result);
}

var text = 'Take this paragraph of text and return an alphabetized list of ALL unique words.  A unique word is any form of a word often communicated with essentially the same meaning. For example, fish and fishes could be defined as a unique word by using their stem fish. For each unique word found in this entire paragraph, determine the how many times the word appears in total. Also, provide an analysis of what unique sentence index position or positions the word is found. The following words should not be included in your analysis or result set: "a", "the", "and", "of", "in", "be", "also" and "as".  Your final result MUST be displayed in a readable console output in the same format as the JSON sample object shown below.';
analyzer(text);