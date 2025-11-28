import { Mail, MessageCircle, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Contact } from "@/interface/contact";

interface ContactCardProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
}

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const getContactTypeBadge = () => {
    return (
      <Badge variant="default" className="text-xs">
        Proveedor
      </Badge>
    );
  };

  const handleWhatsApp = () => {
    const phone = contact.person.phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hola ${contact.person.fullName}, te contacto desde...`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Contacto desde el sistema");
    const body = encodeURIComponent(`Hola ${contact.person.fullName},\n\n`);
    window.location.href = `mailto:${contact.person.email}?subject=${subject}&body=${body}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with Avatar and Type */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {getInitials(contact.person.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {contact.person.fullName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {contact.person.cedula}
                </p>
              </div>
            </div>
            {getContactTypeBadge()}
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            {contact.person.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">
                  {contact.person.email}
                </span>
              </div>
            )}

            {contact.person.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {contact.person.phone}
                </span>
              </div>
            )}

            {contact.person.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">
                  {contact.person.address}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            {contact.person.phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleWhatsApp}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            )}

            {contact.person.email && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEmail}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
