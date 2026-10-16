export const experienceTabs: Record<string, string[]> = {
 sourcelens:['Collection','Question desk','Evidence trail','Source & boundaries'],
 careerlens:['Skill profile','Role rankings','Analysis report','Source & boundaries'],
 form:['Session overview','Movement replay','Session review','Source & boundaries'],
 studybuddy:['Prompt library','Recorded responses','Local pipeline','Source & boundaries'],
 pymentor:['Question terminal','Chain inspector','Test record','Source & boundaries'],
 airbnb:['Notebook workflow','Result explorer','Report artifact','Source & boundaries'],
 'logistic-diabetes':['Notebook workflow','Result explorer','Evaluation plots','Source & boundaries'],
 'random-forest-diabetes':['Notebook workflow','Result explorer','Evaluation plots','Source & boundaries'],
};
export const studyPrompts = ['Explain the OSI model in simple words.','What is normalization in DBMS? Explain 1NF, 2NF and 3NF.','Write a Python program to check whether a number is prime.','Differentiate between TCP and UDP in a simple table.','Summarize the water cycle in 5 points.'];
export function validateExperienceQuestion(input:string): {question:string;error:string|null} {
 // eslint-disable-next-line no-control-regex -- Match Python str.split whitespace, including its documented control characters.
 const question=input.split(/[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+/u).filter(Boolean).join(' ');
 return {question,error:!question?'Question cannot be empty.':Array.from(question).length>2000?'Question is too long. Please keep it under 2000 characters.':null};
}
