// Discord will interpret "maple pyrope wand" as a single string value (with spaces preserved), like this:

// User prompt
`/bot whatis maple pyrope wand`

// And you've registered the whatis option as a string argument, 
const commands = [
  {
    name: 'bot',
    description: 'Bot command',
    options: [
      {
        name: 'whatis',
        description: 'Describe an item or concept',
        type: 3, // STRING
        required: true,
      },
    ],
  },
];


// expected API to receive from discord
{
  "type": 2,
  "data": {
    "name": "bot",
    "options": [
      {
        "name": "whatis",
        "value": "maple pyrope wand"
      }
    ]
  }
}