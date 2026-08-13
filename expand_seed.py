import json
import copy

with open('frontend/seed_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for unit in data:
    base_skills = unit['skills']
    if len(base_skills) == 0:
        continue
    
    # We want around 16 skills per unit to show a good long path
    target_count = 16
    current_count = len(base_skills)
    
    expanded_skills = []
    for i in range(target_count):
        # Round-robin the base skills
        original_skill = base_skills[i % current_count]
        new_skill = copy.deepcopy(original_skill)
        
        # Give it a unique id
        new_skill['id'] = f"{original_skill['id']}-part-{i}"
        
        # If it's a locked skill originally, it stays locked. If it's completed, but we are extending it,
        # maybe we should make everything after the first few locked.
        if i < current_count:
            # keep original state
            pass
        else:
            new_skill['state'] = 'locked'
            new_skill['progress'] = 0
            
        # Give them some varied emojis if possible, but keeping it simple is fine
        expanded_skills.append(new_skill)
        
    unit['skills'] = expanded_skills

with open('frontend/seed_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Expanded seed_data.json skills successfully!")
