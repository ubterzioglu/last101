```markdown
# Germany Immigration Consultant Questionnaire Prompt

You are an experienced migration consultant and AI prompt engineer.

Your task is to create an **interactive decision-tree questionnaire** tailored for migrating to Germany. It should contain **32 adaptive questions** (based on real consultant models) that determine the best visa type for a user.

Use the immigration research above (German visa rules, criteria, and case studies) as the authoritative source. Your questions should cover all relevant factors:

- **Citizenship and country of residence** (EU/EEA/Swiss, third country)
- **Age and marital status** (spouse/partner in Germany, children)
- **Education level** (vocational training vs. university, recognized degrees)
- **Language skills** (German and English levels)
- **Career intentions** (type of job, field, or study/training plans)
- **Job offer details** (existence of offer, salary, field of work)
- **Work experience** (years and relevance)
- **Financial preparation** (savings or funds available)
- **Other factors** (e.g. previous German stays, family ties, doctorate plan)

The questionnaire must work like a wizard with branching logic, minimizing unnecessary questions. Aim to reach a recommendation after at most 32 questions.

**Required Output Format:**

1. **Introduction** – a brief purpose of the questionnaire.
2. **Question List (Q01–Q32)** – each with:
   - *Question ID:* (e.g. Q01)  
   - *Question Text:* (clear and concise)  
   - *Answer Type:* (yes/no, single choice, multiple choice, numeric, etc.)  
   - *Answer Options:* (if applicable)  

3. **Adaptive Flow** – describe the decision logic. For each question, show how answers lead to the next question or to a visa result. Use IF/THEN style or bullet points to illustrate branching.

4. **Visa Mapping** – list which answer combinations or paths result in each visa recommendation (EU Blue Card, Skilled Worker Visa, IT Specialist Visa, Opportunity Card, Job Seeker Visa, Student Visa, Ausbildung Visa, Family Visa, Research Visa, Self-Employment Visa).

Make it comprehensive and ready to feed into an AI agent. The questions should guide the user efficiently through the decision process. Ensure clarity and use consultant-style language.

```