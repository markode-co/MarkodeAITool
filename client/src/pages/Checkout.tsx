// Checkout page using Stripe - blueprint: javascript_stripe
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Shield, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import PayPalButton from "@/components/PayPalButton";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface Plan {
  name: string;
  price: number;
  period: string;
  features: string[];
}

const CheckoutForm = ({ plan }: { plan: Plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      toast({
        title: t("checkout.error.title"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("checkout.success.title"),
        description: t("checkout.success.description"),
      });
      // Redirect to dashboard after successful payment
      setTimeout(() => setLocation("/dashboard"), 2000);
    }
    
    setIsProcessing(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {t("checkout.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Summary */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t("checkout.plan.selected")}</span>
            <Badge variant="outline">{plan.name}</Badge>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span>{t("checkout.total")}</span>
            <span>${plan.price}/{t("checkout.monthly")}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!stripe || !elements || isProcessing}
            data-testid="button-pay"
          >
            {isProcessing ? t("checkout.processing") : t("checkout.pay")}
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            {t("checkout.secure")}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const StripeTestCard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const testStripeConnection = async () => {
    setIsTestingConnection(true);
    try {
      const response = await fetch('/api/stripe-test');
      const data = await response.json();
      
      if (data.success) {
        setConnectionStatus('success');
        toast({
          title: t("checkout.stripe.test.success"),
          description: `Account ID: ${data.accountId}`,
        });
      } else {
        setConnectionStatus('failed');
        toast({
          title: t("checkout.stripe.test.failed"),
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('failed');
      toast({
        title: t("checkout.stripe.test.failed"),
        description: "Network error",
        variant: "destructive",
      });
    }
    setIsTestingConnection(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {connectionStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
          {connectionStatus === 'failed' && <AlertCircle className="w-5 h-5 text-red-600" />}
          {connectionStatus === 'idle' && <Shield className="w-5 h-5" />}
          {t("checkout.stripe.test.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testStripeConnection}
          disabled={isTestingConnection}
          variant="outline"
          className="w-full"
          data-testid="button-test-stripe"
        >
          {isTestingConnection ? t("checkout.loading") : t("checkout.stripe.test.button")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const { t } = useLanguage();
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [paypalAvailable, setPaypalAvailable] = useState<boolean | null>(null);

  // Check PayPal availability
  useEffect(() => {
    const checkPaypalAvailability = async () => {
      try {
        const response = await fetch("/api/paypal/setup");
        setPaypalAvailable(response.ok);
      } catch (error) {
        setPaypalAvailable(false);
      }
    };
    checkPaypalAvailability();
  }, []);

  // Get plan from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    
    // Define available plans
    const plans: Record<string, Plan> = {
      'pro': {
        name: t("plan.pro.name"),
        price: 29,
        period: t("plan.pro.period"),
        features: []
      },
      'enterprise': {
        name: t("plan.enterprise.name"),
        price: 199,
        period: t("plan.enterprise.period"),
        features: []
      }
    };

    const plan = plans[planParam || 'pro'];
    setSelectedPlan(plan);

    if (plan && (planParam === 'pro' || planParam === 'enterprise')) {
      // Create PaymentIntent with secure plan ID
      apiRequest("POST", "/api/create-payment-intent", { 
        planId: planParam
      })
        .then((response) => response.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
        });
    }
  }, [t]);

  if (!selectedPlan) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("checkout.loading")}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("checkout.title")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("checkout.subtitle")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Stripe Connection Test */}
          <StripeTestCard />

          {/* Payment Methods */}
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {t("checkout.payment.method")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Summary */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("checkout.plan.selected")}</span>
                  <Badge variant="outline">{selectedPlan?.name}</Badge>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{t("checkout.total")}</span>
                  <span>${selectedPlan?.price}/{t("checkout.monthly")}</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "stripe" | "paypal")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stripe" data-testid="tab-stripe">
                    {t("checkout.payment.card")}
                  </TabsTrigger>
                  <TabsTrigger value="paypal" data-testid="tab-paypal">
                    {t("checkout.payment.paypal")}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="stripe" className="space-y-4">
                  {clientSecret ? (
                    <Elements 
                      key={`${clientSecret}-${t('common.language')}`}
                      stripe={stripePromise} 
                      options={{ 
                        clientSecret,
                        locale: t('common.language') === 'العربية' ? 'ar' : 'en'
                      }}
                    >
                      <CheckoutForm plan={selectedPlan} />
                    </Elements>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p>{t("checkout.loading")}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="paypal" className="space-y-4">
                  {selectedPlan ? (
                    <div className="space-y-4" data-testid="paypal-section">
                      {paypalAvailable === false ? (
                        <div className="text-center py-8 space-y-4">
                          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                          <div className="space-y-2">
                            <h3 className="font-medium">{t("checkout.paypal.unavailable.title")}</h3>
                            <p className="text-sm text-muted-foreground">
                              {t("checkout.paypal.unavailable.message")}
                            </p>
                          </div>
                        </div>
                      ) : paypalAvailable === true ? (
                        <>
                          <PayPalButton
                            amount={selectedPlan.price.toString()}
                            currency="USD"
                            intent="capture"
                          />
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Shield className="w-4 h-4" />
                            {t("checkout.secure")}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                          <p>{t("checkout.paypal.loading")}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p>{t("checkout.paypal.loading")}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}