
-- ============================================
-- Insert Status Data
-- ============================================
INSERT INTO order_status (status_code, status_name, description) VALUES
('pending', 'Pendente', 'Pedido aguardando processamento'),
('processing', 'Processando', 'Pedido em processamento'),
('completed', 'Concluído', 'Pedido concluído com sucesso'),
('cancelled', 'Cancelado', 'Pedido cancelado');

-- ============================================
-- Insert Orders Data
-- ============================================
INSERT INTO orders (customer_name, order_date, total) VALUES
('João Silva', '2026-01-10', 299.99),
('Maria Santos', '2026-01-09', 159.90),
('Pedro Oliveira', '2026-01-08', 549.99),
('Ana Costa', '2026-01-07', 89.90),
('Carlos Mendes', '2026-01-06', 1299.00);

-- ============================================
-- Insert Order Items Data
-- ============================================
-- Order 1 - João Silva
INSERT INTO order_items (order_id, product_name, quantity, unit_price) VALUES
(1, 'Notebook Lenovo', 1, 249.99),
(1, 'Mouse Logitech', 2, 25.00);

-- Order 2 - Maria Santos
INSERT INTO order_items (order_id, product_name, quantity, unit_price) VALUES
(2, 'Teclado Mecânico', 1, 159.90);

-- Order 3 - Pedro Oliveira
INSERT INTO order_items (order_id, product_name, quantity, unit_price) VALUES
(3, 'Monitor LG 27"', 1, 499.99),
(3, 'Cabo HDMI', 1, 50.00);

-- Order 4 - Ana Costa
INSERT INTO order_items (order_id, product_name, quantity, unit_price) VALUES
(4, 'Webcam HD', 1, 89.90);
-- Order 5 - Carlos Mendes
INSERT INTO order_items (order_id, product_name, quantity, unit_price) VALUES
(5, 'Notebook Dell', 1, 1299.00);

-- ============================================
-- Insert Order Status History Data
-- ============================================
-- Order 1 - João Silva (pending -> processing -> completed)
INSERT INTO order_status_history (order_id, status_id, changed_at, notes) VALUES
(1, 1, '2026-01-10 08:00:00', 'Pedido criado'),
(1, 2, '2026-01-10 09:30:00', 'Pagamento confirmado'),
(1, 3, '2026-01-10 14:00:00', 'Pedido entregue');

-- Order 2 - Maria Santos (pending -> processing)
INSERT INTO order_status_history (order_id, status_id, changed_at, notes) VALUES
(2, 1, '2026-01-09 10:00:00', 'Pedido criado'),
(2, 2, '2026-01-09 11:00:00', 'Em separação');

-- Order 3 - Pedro Oliveira (pending)
INSERT INTO order_status_history (order_id, status_id, changed_at, notes) VALUES
(3, 1, '2026-01-08 15:30:00', 'Pedido criado - aguardando pagamento');
-- Order 4 - Ana Costa (pending -> processing -> completed)
INSERT INTO order_status_history (order_id, status_id, changed_at, notes) VALUES
(4, 1, '2026-01-07 09:00:00', 'Pedido criado'),
(4, 2, '2026-01-07 10:00:00', 'Processando pagamento'),
(4, 3, '2026-01-07 16:00:00', 'Entregue ao cliente');

-- Order 5 - Carlos Mendes (pending -> cancelled)
INSERT INTO order_status_history (order_id, status_id, changed_at, notes) VALUES
(5, 1, '2026-01-06 11:00:00', 'Pedido criado'),
(5, 4, '2026-01-06 12:30:00', 'Cancelado a pedido do cliente');

