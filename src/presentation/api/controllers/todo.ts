import { Request, Response } from 'express';
import * as libxmljs from 'libxmljs2';  // <-- Just change the import to libxmljs2

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

export const importXMLController = (req: Request, res: Response) => {
  try {
    const xmlData = req.body.xml;
    if (!xmlData || typeof xmlData !== 'string') {
      return res.status(400).send('No valid XML data provided');
    }

    const xmlDoc = libxmljs.parseXml(xmlData, {
      noent: true,
      noblanks: true,
      nocdata: true
    });

    // Simple & safe: always get an array
    const todosElements = (xmlDoc.root()?.find('//todo') || []) as any[];

    const importedTodos = todosElements.map((todoElement: any) => ({
      id: parseInt(todoElement.get('id')?.text() || '', 10) || Date.now(),
      text: todoElement.get('text')?.text() || '',
      completed: todoElement.get('completed')?.text() === 'true',
      createdAt: todoElement.get('createdAt')?.text() || new Date().toISOString()
    }));

    res.json({
      message: 'Import successful',
      count: importedTodos.length,
      todos: importedTodos
    });

  } catch (error: any) {
    res.status(400).send('Invalid XML or parsing error: ' + error.message);
  }
};