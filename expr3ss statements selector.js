// ==UserScript==
// @name        New script - expr3ss.com
// @namespace   Violentmonkey Scripts
// @match       https://syc.expr3ss.com/checklist
// @grant       none
// @version     1.0
// @author      -
// @description 12/4/2023, 7:58:58 PM
// ==/UserScript==

const statements = ['Able to give orders',
    'Accurate',
    'Amiable',
    'Appealing',
    'Appreciative',
    'Apologetic',
    'Able to take care of myself',
    'Accepts advice readily',
    'Able to doubt others',
    'Affectionate and understanding',
    'Act to show my importance',
    'Able to criticize myself',
    'Admires and imitates others',
    'Agrees with everyone',
    'Agreeable',
    'Always ashamed of myself',
    'Attractive personality',
    'Very anxious to be approved of',
    'Always giving advice',
    'Bitter',
    'Big-hearted and unselfish',
    'Boastful',
    'Bold',
    'Businesslike',
    'Bossy',
    'Can be frank and honest',
    'Clings to others',
    'Can be strict if necessary',
    'Charming',
    'Considerate',
    'Cold and unfeeling',
    'Can complain if necessary',
    'Careful',
    'Controlled',
    'Cooperative',
    'Competitive ',
    'Complaining ',
    'Conscientious ',
    'Can be indifferent to others',
    'Critical of others',
    'Can be obedient',
    'Cruel and unkind',
    'Daring ',
    'Dependent on others',
    'Dictatorial',
    'Diplomatic',
    'Direct',
    'Distrusts everyone',
    'Dominating',
    'Embarrassed easily',
    'Eager to get along with others',
    'Easily fooled',
    'Easygoing',
    'Egotistical and conceited',
    'Easily led',
    'Encouraging to others',
    'Enjoys taking care of others',
    'Enthusiastic ',
    'Even tempered ',
    'Expects everyone to admire me',
    'Expressive',
    'Frequently disappointed',
    'Firm but just and fair',
    'Fond of everyone',
    'Forceful person',
    'Friendly',
    'Forgives anything and everything',
    'Frequently angry',
    'Friendly all the time',
    'Generous to a fault',
    'Gentle',
    'Give freely of myself',
    'Good leader',
    'Good mixer ',
    'Good natured ',
    'Grateful person',
    'Tough when necessary',
    'Helpful',
    'Hard-hearted',
    'Hard to impress',
    'High spirited ',
    'Honest',
    'Impatient with others mistakes',
    'Independent',
    'Irritable',
    'Jealous',
    'Kind and reassuring',
    'Likes responsibility',
    'Lacks self-confidence',
    'Likes to compete with others',
    'Lets others make the decisions',
    'Likes everybody',
    'Likes to be taken care of',
    'Logical ',
    'Loves everybody',
    'Makes a good impression',
    'Manages others',
    'Meek',
    'Modest',
    'Hardly ever talks back',
    'Often admired',
    'Obeys too willingly',
    'Often bored',
    'Often gloomy',
    'Often ignored',
    'Outspoken',
    'Overprotective of others',
    'Often unfriendly',
    'Over sympathetic',
    'Often helped by others',
    'Outgoing',
    'Outsider',
    'Passive and unaggressive',
    'Pioneering ',
    'Proud and self-satisfied',
    'Always pleasant and agreeable',
    'Resentful',
    'Respected by others',
    'Rebels against everything',
    'Resents being bossed around',
    'Reserved',
    'Restless',
    'Self-reliant and assertive',
    'Sarcastic',
    'Self-punishing',
    'Self-confident',
    'Self-seeking',
    'Shrewd and calculating',
    'Self-respecting',
    'Shy',
    'Selfish',
    'Sceptical',
    'Sociable and neighbourly',
    'Slow to forgive a wrong',
    'Somewhat snobbish',
    'Spineless and cowardly',
    'Stern but fair',
    'Spoils people with kindness',
    'Straightforward and direct',
    'Strong willed ',
    'Stubborn',
    'Sympathetic ',
    'Tactful ',
    'Talkative ',
    'Thorough',
    'Too easily influenced by others',
    'Think only of myself',
    'Tender and soft-hearted',
    'Timid',
    'Too lenient with others',
    'Touchy and easily hurt',
    'Too willing to give to others',
    'Tries to be too successful',
    'Trusting and eager to please',
    'Trustworthy',
    'Tries to comfort everyone',
    'Usually gives in',
    'Very respectful of authority',
    'Vigorous',
    'Wants everyone's love',
'Well thought of',
    'Wants to be led',
    'Wants to be praised',
    'Will confide in anyone',
    'Warm',
    'Want everyone to like me',
    'Well disciplined',
    'Will believe anyone'];

const statements_selected = [];

const statements_checkboxes = document.querySelector("#fadeBlock");

(function () {
    'use strict';

    try { //check if jquery is provided by expr3ss
        $().jquery
    } catch {
        alert('jQuery is not loaded, try loading it yourself?');
        return;
    }

    statements_selected.forEach(v => {
        $(`.fancyCheckbox:contains('${v}')`).siblings('input').prop('checked', true);
    });

})();

