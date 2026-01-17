#!/bin/bash

echo "🚀 Executando testes do Debezium..."
echo ""
echo "Este script irá:"
echo "  1. Inserir pedidos"
echo "  2. Adicionar itens"
echo "  3. Atualizar status"
echo "  4. Fazer updates e deletes"
echo ""
echo "Abra http://localhost:8080 (Kafka UI) para ver as mensagens!"
echo ""
read -p "Pressione ENTER para começar..."

echo ""
echo "📝 1. Criando pedidos..."
docker exec -i postgres psql -U user -d erp << 'EOF'
INSERT INTO orders (customer_name, order_date, total)
VALUES 
  ('Maria Silva', NOW(), 150.00),
  ('João Santos', NOW(), 320.50),
  ('Ana Costa', NOW(), 89.90);
SELECT * FROM orders;
EOF

echo ""
echo "✅ Pedidos criados! Verifique o tópico 'erp.public.orders' no Kafka UI"
echo ""
read -p "Pressione ENTER para continuar..."

echo ""
echo "📝 2. Adicionando itens aos pedidos..."
docker exec -i postgres psql -U user -d erp << 'EOF'
INSERT INTO order_items (order_id, product_name, quantity, price)
VALUES 
  (1, 'Notebook Dell', 1, 150.00),
  (2, 'Mouse Logitech', 2, 45.00),
  (2, 'Teclado Mecânico', 1, 230.50),
  (3, 'Webcam HD', 1, 89.90);
SELECT * FROM order_items;
EOF

echo ""
echo "✅ Itens adicionados! Verifique o tópico 'erp.public.order_items' no Kafka UI"
echo ""
read -p "Pressione ENTER para continuar..."

echo ""
echo "📝 3. Atualizando status dos pedidos..."
docker exec -i postgres psql -U user -d erp << 'EOF'
INSERT INTO order_status_history (order_id, status_id, notes)
VALUES 
  (1, 2, 'Pedido confirmado e em processamento'),
  (2, 2, 'Processando pagamento'),
  (3, 2, 'Verificando estoque');
SELECT * FROM order_status_history;
EOF

echo ""
echo "✅ Status atualizados! Verifique o tópico 'erp.public.order_status_history' no Kafka UI"
echo ""
read -p "Pressione ENTER para continuar..."

echo ""
echo "📝 4. Fazendo UPDATE em um pedido..."
docker exec -i postgres psql -U user -d erp << 'EOF'
UPDATE orders SET total = 180.00 WHERE order_id = 1;
SELECT * FROM orders WHERE order_id = 1;
EOF

echo ""
echo "✅ Pedido atualizado! Veja a operação de UPDATE no Kafka"
echo ""
read -p "Pressione ENTER para continuar..."

echo ""
echo "📝 5. Finalizando pedido..."
docker exec -i postgres psql -U user -d erp << 'EOF'
INSERT INTO order_status_history (order_id, status_id, notes)
VALUES (1, 4, 'Pedido entregue com sucesso!');
SELECT * FROM order_status_history WHERE order_id = 1;
EOF

echo ""
echo "✅ Pedido finalizado!"
echo ""
read -p "Pressione ENTER para continuar..."

echo ""
echo "📝 6. Cancelando um pedido..."
docker exec -i postgres psql -U user -d erp << 'EOF'
INSERT INTO order_status_history (order_id, status_id, notes)
VALUES (3, 5, 'Cliente solicitou cancelamento');
UPDATE orders SET total = 0 WHERE order_id = 3;
SELECT * FROM orders WHERE order_id = 3;
EOF

echo ""
echo "✅ Pedido cancelado!"
echo ""
read -p "Pressione ENTER para ver DELETE..."

echo ""
echo "📝 7. Deletando um item (teste DELETE)..."
docker exec -i postgres psql -U user -d erp << 'EOF'
DELETE FROM order_items WHERE item_id = 4;
SELECT * FROM order_items;
EOF

echo ""
echo "✅ Item deletado! Veja a operação de DELETE no Kafka"
echo ""
echo "🎉 Teste completo!"
echo ""
echo "📊 Resumo final:"
docker exec -i postgres psql -U user -d erp << 'EOF'
SELECT 'PEDIDOS' as tabela, COUNT(*) as total FROM orders
UNION ALL
SELECT 'ITENS', COUNT(*) FROM order_items
UNION ALL
SELECT 'STATUS', COUNT(*) FROM order_status_history;
EOF

echo ""
echo "✨ Agora verifique:"
echo "  - Kafka UI: http://localhost:8080"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend logs para ver o consumo das mensagens"
echo ""
