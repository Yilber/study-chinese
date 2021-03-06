$(document).ready(() => {
    const url     = './js/data.json?ver=1.0.17';
    const options = {
        width: 100,
        height: 100,
        padding: 0,
        showOutline: false,
        strokeColor: '#3cb4b4',
        radicalColor: '#d63a37'
    };

    const inverse = true;
    const wrongCards = [];
    let writerFront = {};
    let writerFront2 = {};
    let writerBack = {};
    let writerBack2 = {};
    let writerFront3 = {};
    let writerBack3 = {};
    let dictionary  = [];
    let sequence    = [];
    let currentCard = 0;
    let cardSize    = 0;
    let lesson      = $('#lesson option:selected').val() * 1;
    let dialogue    = 'all';

    function drawCharacter(cardPosition) {
        /* Solves the multiple characters rendered at once problem */
        if ($('#flashcard--character--front svg > g').length > 1) {
            $('#flashcard--character--front').find('svg > g:not(:last)').remove();
            // console.log('there was a problem with front');
        } else if ($('#flashcard--character--front-2 svg > g').length > 1) {
            $('#flashcard--character--front-2').find('svg > g:not(:last)').remove();
            // console.log('there was a problem with front 2');
        } else if ($('#flashcard--character--front-3 svg > g').length > 1) {
            $('#flashcard--character--front-3').find('svg > g:not(:last)').remove();
            // console.log('there was a problem with front 3');
        }

        if ($('#flashcard--character--back svg > g').length > 1) {
            $('#flashcard--character--back').find('svg > g:not(:last)').remove();
            // console.log('there was a problem with back');
        } else if ($('#flashcard--character--back-2 svg > g').length > 1) {
            $('#flashcard--character--back-2').find('svg > g:not(:last)').remove();
            // console.log('there was a problem with back 2');
        } else if ($('#flashcard--character--back-3 svg > g').length > 1) {
            $('#flashcard--character--back-3').find('svg > g:not(:last)').remove();
            // console.log('there was a problem with back 3');
        }

        if (inverse) {
            switch (dictionary.items[cardPosition].character.length) {
                case 1:
                    writerFront.setCharacter(dictionary.items[cardPosition].character);
                    writerBack.setCharacter(dictionary.items[cardPosition].character);

                    $('#flashcard--character--front-2').css({ display: 'none' });
                    $('#flashcard--character--back-2').css({ display: 'none' });

                    $('#flashcard--character--front-3').css({ display: 'none' });
                    $('#flashcard--character--back-3').css({ display: 'none' });
                    break;
                case 2:
                    writerFront.setCharacter(dictionary.items[cardPosition].character[0]);
                    writerFront2.setCharacter(dictionary.items[cardPosition].character[1]);

                    writerBack.setCharacter(dictionary.items[cardPosition].character[0]);
                    writerBack2.setCharacter(dictionary.items[cardPosition].character[1]);

                    $('#flashcard--character--front-2').css({ display: 'block' });
                    $('#flashcard--character--back-2').css({ display: 'block' });

                    $('#flashcard--character--front-3').css({ display: 'none' });
                    $('#flashcard--character--back-3').css({ display: 'none' });
                    break;
                default:
                    writerFront.setCharacter(dictionary.items[cardPosition].character[0]);
                    writerBack.setCharacter(dictionary.items[cardPosition].character[0]);

                    writerFront2.setCharacter(dictionary.items[cardPosition].character[1]);
                    writerBack2.setCharacter(dictionary.items[cardPosition].character[1]);

                    writerFront3.setCharacter(dictionary.items[cardPosition].character[2]);
                    writerBack3.setCharacter(dictionary.items[cardPosition].character[2]);

                    $('#flashcard--character--front-2').css({ display: 'block' });
                    $('#flashcard--character--back-2').css({ display: 'block' });

                    $('#flashcard--character--front-3').css({ display: 'block' });
                    $('#flashcard--character--back-3').css({ display: 'block' });
                    break;
            }
        } else {
            $('#flashcard--character--front').css({ display: 'none' });
            $('#flashcard--character--front-2').css({ display: 'none' });
            $('#flashcard--character--front-3').css({ display: 'none' });

            switch (dictionary.items[cardPosition].character.length) {
                case 1:
                    writerBack.setCharacter(dictionary.items[cardPosition].character);
                    $('#flashcard--character--back-2').css({ display: 'none' });
                    $('#flashcard--character--back-3').css({ display: 'none' });
                    break;
                case 2:
                    writerBack.setCharacter(dictionary.items[cardPosition].character[0]);
                    writerBack2.setCharacter(dictionary.items[cardPosition].character[1]);

                    $('#flashcard--character--back-2').css({ display: 'block' });
                    $('#flashcard--character--back-3').css({ display: 'none' });
                    break;
                default:
                    writerBack.setCharacter(dictionary.items[cardPosition].character[0]);
                    writerBack2.setCharacter(dictionary.items[cardPosition].character[1]);
                    writerBack3.setCharacter(dictionary.items[cardPosition].character[2]);

                    $('#flashcard--character--back-2').css({ display: 'block' });
                    $('#flashcard--character--back-3').css({ display: 'block' });
                    break;
            }
        }

        $('.flashcard--card-number').html((cardPosition * 1) + 1);
        $('.flashcard--meaning').html(dictionary.items[cardPosition].meaning);
        $('.flashcard--pinyin').html(dictionary.items[cardPosition].pinyin);
    }

    function getCard(cardPosition) {
        if ($('.flashcard').hasClass('flashcard--flip')) {
            $('.flashcard').removeClass('flashcard--flip');

            setTimeout(() => {
                drawCharacter(cardPosition);
            }, 500);
        } else {
            drawCharacter(cardPosition);
        }
    }

    function sequenceGenerator(isRandom) {
        const posible = [];
        const generatedSequence = [];
        let seed = 0;
        let size = dictionary.items.length;

        if (lesson === -1) {
            for (let i = 0; i < size; i += 1) {
                posible.push(i);
            }
        } else if (dialogue !== 'all') {
            for (let i = 0; i < size; i += 1) {
                if (dictionary.items[i].lesson === lesson &&
                    dictionary.items[i].dialogue === dialogue) {
                    posible.push(i);
                }
            }
        } else {
            for (let i = 0; i < size; i += 1) {
                if (dictionary.items[i].lesson === lesson) {
                    posible.push(i);
                }
            }
        }

        if (!isRandom) {
            return posible;
        }

        size = posible.length;

        for (let i = 0; i < size; i += 1) {
            seed = Math.floor(Math.random() * posible.length);
            generatedSequence.push(posible[seed]);
            posible[seed] = posible[0];
            // removes the first item on the array
            posible.shift();
        }

        return generatedSequence;
    }

    function setup() {
        if (dictionary.items[0].character.length === 1) {
            if (inverse) {
                writerFront  = new HanziWriter('flashcard--character--front', dictionary.items[sequence[currentCard]].character, options);
                writerFront2 = new HanziWriter('flashcard--character--front-2', dictionary.items[sequence[currentCard]].character, options);
                writerFront3 = new HanziWriter('flashcard--character--front-3', dictionary.items[sequence[currentCard]].character, options);

                $('#flashcard--character--front').css({ display: 'block' });
                $('#flashcard--character--front-2').css({ display: 'none' });
                $('#flashcard--character--front-3').css({ display: 'none' });
            }

            writerBack   = new HanziWriter('flashcard--character--back', dictionary.items[sequence[currentCard]].character, options);
            writerBack2  = new HanziWriter('flashcard--character--back-2', dictionary.items[sequence[currentCard]].character, options);
            writerBack3  = new HanziWriter('flashcard--character--back-3', dictionary.items[sequence[currentCard]].character, options);

            $('#flashcard--character--back-2').css({ display: 'none' });
            $('#flashcard--character--back-3').css({ display: 'none' });
        }

        $('.flashcard--card-number').html(sequence[(currentCard * 1)] + 1);
        $('.flashcard--meaning').html(dictionary.items[0].meaning);
        $('.flashcard--pinyin').html(dictionary.items[0].pinyin);
    }

    function update() {
        currentCard = 0;
        lesson      = $('#lesson option:selected').val() * 1;

        if (lesson === 0) {
            const value = $('input[name=dialogue-0]:checked').val();
            dialogue = value === 'all' ? value : $('input[name=dialogue-0]:checked').val() * 1;
        } else {
            const value = $('input[name=dialogue]:checked').val();
            dialogue = value === 'all' ? value : $('input[name=dialogue]:checked').val() * 1;
        }

        sequence = sequenceGenerator($('input[name=cardsOrder]:checked', '.flashcard__order').val() === 'random');
        cardSize = sequence.length;
        getCard(sequence[currentCard]);
    }

    function watcher() {
        $('.flashcard__flip-switch').on('click', () => {
            if ($('.flashcard').hasClass('flashcard--flip')) {
                $('.flashcard').removeClass('flashcard--flip');
            } else {
                $('.flashcard').addClass('flashcard--flip');
            }
        });

        $('.flashcard__back--top-side').on('click', () => {
            writerBack.hideCharacter();

            if (dictionary.items[sequence[currentCard]].character.length !== 1) {
                writerBack2.hideCharacter();
                writerBack3.hideCharacter();

                writerBack.animateCharacter({
                    onComplete: () => {
                        setTimeout(() => {
                            writerBack2.animateCharacter({
                                onComplete: () => {
                                    setTimeout(() => {
                                        writerBack3.animateCharacter();
                                    }, 500);
                                }
                            });
                        }, 500);
                    }
                });
            } else {
                writerBack.animateCharacter();
            }
        });

        $('#lesson').on('change', () => {
            if (($('#lesson option:selected').val() * 1) === -1) {
                $('#dialogue-choice').hide();
            } else if (($('#lesson option:selected').val() * 1) === 0) {
                $('#lessons').hide();
                $('#lesson-0').show();
                $('#dialogue-choice').show();
            } else {
                $('#lessons').show();
                $('#lesson-0').hide();
                $('#dialogue-choice').show();
            }
        });

        $('#update').on('click', (e) => {
            e.preventDefault();
            update();
        });

        $('.next').click((e) => {
            e.preventDefault();

            if (currentCard < cardSize - 1) {
                currentCard += 1;
                getCard(sequence[currentCard]);
            }
        });

        $('.prev').click((e) => {
            e.preventDefault();

            if (currentCard > 0) {
                currentCard -= 1;
                getCard(sequence[currentCard]);
            }
        });

        $('.wrong-card').click((e) => {
            e.preventDefault();

            wrongCards.push(sequence[currentCard]);

            if (currentCard < cardSize - 1) {
                currentCard += 1;
                getCard(sequence[currentCard]);
            }
        });

        $('.play-wrong-card').click((e) => {
            e.preventDefault();

            sequence = Array.from(wrongCards);
            cardSize = sequence.length;
            currentCard = 0;
            getCard(sequence[currentCard]);
            console.log(sequence);
        });
    }

    $.getJSON(url, (data) => {
        dictionary = data;
        sequence   = sequenceGenerator(false);
        cardSize   = sequence.length;

        $('#lessons').show();
        $('#lesson-0').hide();

        setup();
        watcher();
        update();
    });
});
