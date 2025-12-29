import { Request, Response } from 'express';

// WARNING: This is intentionally vulnerable to XXE
export const exportXMLController = (req: Request, res: Response) => {
  try {
    const todos = req.body;

    if (!Array.isArray(todos)) {
      return res.status(400).send('Invalid data format');
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<todos>\n';

    todos.forEach((todo: any) => {
      xml += `  <todo>\n`;
      xml += `    <id>${todo.id}</id>\n`;
      xml += `    <text>${todo.text}</text>\n`; // No CDATA protection
      xml += `    <completed>${todo.completed}</completed>\n`;
      xml += `    <createdAt>${todo.createdAt}</createdAt>\n`;
      xml += `  </todo>\n`;
    });

    xml += '</todos>';

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating XML');
  }
};

// Vulnerable XML import with XXE
export const importXMLController = (req: Request, res: Response) => {
  try {
    const xmlData = req.body.xml;

    if (!xmlData) {
      return res.status(400).send('No XML data provided');
    }

    const parseString = require('xml2js').parseString;

    parseString(xmlData, {
      explicitArray: false,
      // DANGER: Not disabling external entities
      // This would normally be set to false in secure code: ignoreDecl: true
    }, (err: any, result: any) => {
      if (err) {
        return res.status(400).send('Invalid XML format');
      }

      if (!result || !result.todos) {
        return res.status(400).send('Invalid XML structure');
      }

      let todoArray = [];
      if (Array.isArray(result.todos.todo)) {
        todoArray = result.todos.todo;
      } else if (result.todos.todo) {
        todoArray = [result.todos.todo];
      }

      const importedTodos = todoArray.map((todo: any) => ({
        id: parseInt(todo.id) || Date.now(),
        text: todo.text || '',
        completed: todo.completed === 'true',
        createdAt: todo.createdAt || new Date().toISOString()
      }));

      res.json({
        message: 'Import successful',
        count: importedTodos.length,
        todos: importedTodos
      });
    });

  } catch (error) {
    res.status(500).send('Error processing XML');
  }
};