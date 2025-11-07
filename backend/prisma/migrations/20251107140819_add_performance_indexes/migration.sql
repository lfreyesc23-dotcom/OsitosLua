-- CreateIndex
CREATE INDEX "Coupon_codigo_idx" ON "Coupon"("codigo");

-- CreateIndex
CREATE INDEX "Coupon_activo_fechaExpiracion_idx" ON "Coupon"("activo", "fechaExpiracion");

-- CreateIndex
CREATE INDEX "Coupon_activo_idx" ON "Coupon"("activo");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_userId_status_idx" ON "Order"("userId", "status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_emailInvitado_idx" ON "Order"("emailInvitado");

-- CreateIndex
CREATE INDEX "Product_categoria_idx" ON "Product"("categoria");

-- CreateIndex
CREATE INDEX "Product_categoria_createdAt_idx" ON "Product"("categoria", "createdAt");

-- CreateIndex
CREATE INDEX "Product_precio_idx" ON "Product"("precio");

-- CreateIndex
CREATE INDEX "Review_productId_aprobado_idx" ON "Review"("productId", "aprobado");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_aprobado_idx" ON "Review"("aprobado");

-- CreateIndex
CREATE INDEX "Suggestion_leido_idx" ON "Suggestion"("leido");

-- CreateIndex
CREATE INDEX "Suggestion_respondido_idx" ON "Suggestion"("respondido");
