# Testing Certificate Flow Instructions

## How to Test 70% Certificate Banner

### Step 1: Open your application
Navigate to: http://localhost:5173/training/modules/entrepreneurship-mastery

### Step 2: Open Browser Console
- Press `F12` or `Right Click` → `Inspect` → Go to `Console` tab

### Step 3: Set Progress to 70%
Copy and paste this command in console to simulate 70% completion:

```javascript
localStorage.setItem('completedTopics', JSON.stringify([
  '1-1.1', '1-1.2', '1-1.3', '1-1.4', '1-1.5',
  '2-2.1', '2-2.2', '2-2.3', '2-2.4', '2-2.5',
  '3-3.1', '3-3.2', '3-3.3', '3-3.4', '3-3.5',
  '4-4.1', '4-4.2', '4-4.3', '4-4.4', '4-4.5',
  '5-5.1', '5-5.2', '5-5.3', '5-5.4', '5-5.5',
  '6-6.1', '6-6.2', '6-6.3', '6-6.4', '6-6.5',
  '7-7.1', '7-7.2', '7-7.3'
]));
```

### Step 4: Refresh the Page
Press `F5` or click refresh button

### Step 5: Verify
- You should see an **Orange banner** saying "Get Your Certificate!" with 70% completion message

---

## How to Test 100% Certificate Flow

### Step 1: Open Browser Console
- Press `F12` → Go to `Console` tab

### Step 2: Set Progress to 100%
Copy and paste this command in console to simulate 100% completion:

```javascript
localStorage.setItem('completedTopics', JSON.stringify([
  '1-1.1', '1-1.2', '1-1.3', '1-1.4', '1-1.5',
  '2-2.1', '2-2.2', '2-2.3', '2-2.4', '2-2.5',
  '3-3.1', '3-3.2', '3-3.3', '3-3.4', '3-3.5',
  '4-4.1', '4-4.2', '4-4.3', '4-4.4', '4-4.5',
  '5-5.1', '5-5.2', '5-5.3', '5-5.4', '5-5.5',
  '6-6.1', '6-6.2', '6-6.3', '6-6.4', '6-6.5',
  '7-7.1', '7-7.2', '7-7.3', '7-7.4', '7-7.5',
  '8-8.1', '8-8.2', '8-8.3', '8-8.4', '8-8.5',
  '9-9.1', '9-9.2', '9-9.3', '9-9.4'
]));
```

### Step 3: Refresh the Page
Press `F5`

### Step 4: Verify
- You should see a **Green "Congratulations!" banner** saying "You've completed all modules"
- Click **"Get Your Certificate"** button
- You'll see a blurred certificate with payment overlay
- Click **"Unlock Certificate - ₹199"**
- Certificate will unlock and show properly

---

## How to Clear Progress

To reset progress and start fresh:

```javascript
localStorage.removeItem('completedTopics');
```

Then refresh the page.

---

## Testing Different Progress Levels

### 50% Progress
```javascript
localStorage.setItem('completedTopics', JSON.stringify([
  '1-1.1', '1-1.2', '1-1.3', '1-1.4', '1-1.5',
  '2-2.1', '2-2.2', '2-2.3', '2-2.4', '2-2.5',
  '3-3.1', '3-3.2', '3-3.3', '3-3.4', '3-3.5',
  '4-4.1', '4-4.2', '4-4.3', '4-4.4', '4-4.5'
]));
```

### 30% Progress
```javascript
localStorage.setItem('completedTopics', JSON.stringify([
  '1-1.1', '1-1.2', '1-1.3', '1-1.4', '1-1.5',
  '2-2.1', '2-2.2', '2-2.3', '2-2.4', '2-2.5',
  '3-3.1', '3-3.2', '3-3.3'
]));
```

---

## Important Notes

- The certificate page uses `certificatePaid` localStorage key for payment status
- To reset payment status: `localStorage.removeItem('certificatePaid')`
- Topic IDs format: `moduleId-topicId` (e.g., '1-1.1', '2-2.1')
- Currently only 3 modules have detailed data in entrepreneurshipTraining.js
- For full testing, you may need to complete actual topics through the UI

